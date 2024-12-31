import {initTransformersEnv} from './config';
import {pipeline, type TextGenerationPipeline} from '@huggingface/transformers';
import {hasWebGPU} from './util';

/** 模型 */
class Model {
    // @ts-ignore
    private pipe: TextGenerationPipeline;

    async init() {
        initTransformersEnv();

        try {
            this.pipe = await pipeline('text-generation', 'qwen', {
                ...(await hasWebGPU() ? {device: 'webgpu', dtype: 'q8'} : {}),
            });
        }
        catch (error) {
            console.error('初始化模型失败', error);
        }
    }

    async chat(prompt: string) {
        if (!this.pipe) {
            await this.init();
        }

        const messages = [
            {role: 'system', content: '你是一个有用且知识渊博的助手'},
            {role: 'user', content: prompt},
        ];

        const text = this.pipe.tokenizer.apply_chat_template(messages, {
            tokenize: false,
            add_generation_prompt: true,
        });

        console.log('模版输入', text);

        // @ts-ignore
        const result = await this.pipe(text, {
            max_new_tokens: 100,
            return_full_text: false,
        });
        console.log('模型输出', result);
        return result;
    }
}

export default new Model();
