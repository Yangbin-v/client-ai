import {pipeline, TextGenerationPipeline, env, TextStreamer} from '@huggingface/transformers';

// Specify a custom location for models (defaults to '/models/').
env.remoteHost = `${window.location.origin}`;
env.remotePathTemplate = '{model}/';

/** 模型 */
class Model {
    // @ts-expect-error TextGenerationPipeline 允许缺省
    private generator: TextGenerationPipeline;

    async init() {
        this.generator = await pipeline('text-generation', 'model/deepSeek-distill-qwen', {
            dtype: 'q4f16'
        });

        // this.generator = await pipeline('text-generation', 'onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX', {
        //     dtype: 'q4f16'
        // });
    }

    async chat(prompt: string) {
        if (!this.generator) {
            await this.init();
        }

        // 模型执行会严重占用资源，会导致页面渲染滞后
        // 所以需要等待页面渲染完成
        await new Promise((resolve) => setTimeout(resolve, 0));

        const messages = [
            {role: 'user', content:  'Solve the equation: x^2 - 3x + 2 = 0'}
        ];

        const streamer = new TextStreamer(this.generator.tokenizer, {
            skip_prompt: true,
            // callback_function: (text) => { }, // Optional callback function
        });

        console.log(streamer);

        // Generate text
        const output = await this.generator(messages, {
            max_new_tokens: 8,
            do_sample: false,
            streamer,
            use_cache: false
        });

        console.log(output);

        // @ts-expect-error 忽略类型检查
        return output[0].generated_text;
    }
}

export default new Model();
