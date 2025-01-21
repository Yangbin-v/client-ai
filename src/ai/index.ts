import {pipeline, TextGenerationPipeline} from '@huggingface/transformers';

/** 模型 */
class Model {
    // @ts-expect-error TextGenerationPipeline 允许缺省
    private generator: TextGenerationPipeline;

    async init() {
        this.generator = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct');
    }

    async chat(prompt: string) {
        const messages = [
            {role: 'system', content: 'You are a helpful assistant.'},
            {role: 'user', content: prompt}
        ];

        // Apply chat template
        const text = this.generator.tokenizer.apply_chat_template(messages, {
            tokenize: false,
            add_generation_prompt: true,
        });

        // Generate text
        // @ts-expect-error 忽略类型检查
        const output = await this.generator(text, {
            max_new_tokens: 128,
            do_sample: false,
            return_full_text: false,
        });

        console.log(output);

        return output[0].generated_text;
    }
}

export default new Model();
