import {pipeline, TextGenerationPipeline, env} from '@huggingface/transformers';
import {pluginMap} from '../plugin';
import {hasWebGPU} from './util';

// Specify a custom location for models (defaults to '/models/').
env.remoteHost = `${window.location.origin}`;
env.remotePathTemplate = '{model}/';

let systemPromptAPI = `你是一个智能助手，可以调用以下函数来完成用户请求。
请在回答时判断是否需要调用下列可用函数列表中的函数，并返回你要调用的函数名称及参数，格式必须严格按照下面的 JSON 模板输出，不要添加其他说明文字。
如果下列可用函数列表中没有需要调用的函数，返回不支持该能力。

可用函数：
1. getWeather
   - 描述：获取指定地点的天气信息
   - 参数：
     - location (string)：城市名称，例如 "北京" 或 "上海"

2. sendEmail
   - 描述：发送内容到指定邮箱
   - 参数：
     - to (string)：收件人邮箱
     - content (string)：邮件内容

3. orderTakeout
   - 描述：在指定餐厅点外卖
   - 参数：
     - restaurant (string)：餐厅名称
     - food (string)：菜品名称

输出格式（严格遵循）：
{
  "function": "函数名称",
  "parameters": {
    "参数名": "参数值",
    ...
  }
}

现在，请根据用户请求返回你要调用的函数和参数：`;

let systemPromptDefault = `你是一个智能助手。`;

const messages = [
    {role: 'system', content: systemPromptAPI},
];

/** 模型 */
class Model {
    // @ts-expect-error TextGenerationPipeline 允许缺省
    private generator: TextGenerationPipeline;

    async init() {
        const canUseWebGPU = await hasWebGPU();
        this.generator = await pipeline('text-generation', 'model/qwen', {
            dtype: 'q4f16',
            device: canUseWebGPU ? 'webgpu' : 'auto'
        });
    }

    async chat(prompt: string, role: 'user' | 'system' = 'user'): Promise<any> {
        if (!this.generator) {
            await this.init();
        }

        messages.push({role, content: prompt});

        // 模型执行会严重占用资源，会导致页面渲染滞后
        // 所以需要等待页面渲染完成
        await new Promise((resolve) => setTimeout(resolve, 0));

        const text = this.generator.tokenizer.apply_chat_template(messages, {
            tokenize: false,
            add_generation_prompt: true,
        });

        // Generate text
        // @ts-expect-error 忽略类型检查
        const output = await this.generator(text, {
            max_new_tokens: 512,
            do_sample: false,
            return_full_text: false
        });

        // @ts-expect-error 忽略类型检查
        messages.push({role: 'assistant', content: output[0].generated_text});

        // @ts-expect-error 忽略类型检查
        const modelOuput = output[0].generated_text;

        let functionInfo = null;
        try {
            functionInfo = JSON.parse(modelOuput);
        }
        catch {}

        if (functionInfo) {
            let result = '';
            console.log(`调用 API: ${functionInfo.function}`);
            // @ts-expect-error 忽略类型检查
            const plugin = pluginMap[functionInfo.function];
            if (plugin) {
                result = plugin(functionInfo.parameters);
            }
            else {
                result = '不支持该能力，可以问我其他问题';
            }

            console.log(`API 返回: ${result}`);

            return this.chat(`根据信息"${result}"，返回对用户友好的内容，不要遗漏具体的数值`, 'system');
        }

        return modelOuput;
    }
}

export default new Model();
