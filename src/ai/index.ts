import {pipeline, TextGenerationPipeline, env} from '@huggingface/transformers';

// Specify a custom location for models (defaults to '/models/').
env.remoteHost = `${window.location.origin}`;
env.remotePathTemplate = '{model}/';

const messages = [
    {role: 'system', content: 'You are a helpful assistant.'},
];

/** 模型 */
class Model {
    // @ts-expect-error TextGenerationPipeline 允许缺省
    private generator: TextGenerationPipeline;

    async init() {
        this.generator = await pipeline('text-generation', 'model/qwen', {
            dtype: 'q4f16'
        });
    }

    async chat(prompt: string) {
        if (!this.generator) {
            await this.init();
        }

        messages.push({role: 'user', content: prompt});

        // 模型执行会严重占用资源，会导致页面渲染滞后
        // 所以需要等待页面渲染完成
        await new Promise((resolve) => setTimeout(resolve, 0));

        const text = this.generator.tokenizer.apply_chat_template(messages, {
            tokenize: false,
            add_generation_prompt: true,
        });

        console.log(text);

        // Generate text
        // @ts-expect-error 忽略类型检查
        const output = await this.generator(text, {
            max_new_tokens: 512,
            do_sample: false,
            return_full_text: false
        });

        console.log(output);

        // @ts-expect-error 忽略类型检查
        messages.push({role: 'assistant', content: output[0].generated_text});

        // @ts-expect-error 忽略类型检查
        return output[0].generated_text;
    }
}

export default new Model();
