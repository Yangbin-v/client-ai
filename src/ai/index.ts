import * as ort from 'onnxruntime-web';
import {getModelInput, decodeOutput, tokenizeMessages} from './util';

ort.env.wasm.wasmPaths = '/';  // WASM 文件在 public 目录下

/** 模型 */
class Model {
    // @ts-expect-error TextGenerationPipeline 允许缺省
    private session: ort.InferenceSession;

    async init() {
        this.session = await ort.InferenceSession.create('/model/model.onnx');
    }

    async chat(prompt: string) {
        if (!this.session) {
            await this.init();
        }

        let messages = [
            {
                role: 'system',
                content: 'You are bugmaster, created by kedaya. You are a helpful assistant.'
            },
            {
                role: 'user',
                content: 'hello, who are you?'
            },
            {
                role: 'assistant',
                content: 'hello, i am bugmaster, how can i help you?'
            },
            {
                role: 'user',
                content: prompt
            }
        ];
        let promptFinal = await tokenizeMessages(messages);
        let fullResponse = '';

        // 最大生成长度限制，防止无限循环
        const MAX_LENGTH = 500;

        while (fullResponse.length < MAX_LENGTH) {
            const inputData = await getModelInput(promptFinal as string);

            const outputs = await this.session.run(inputData);
            console.log('outputs', outputs);

            // @ts-expect-error TextGenerationPipeline 允许缺省
            const nextToken = await decodeOutput(outputs);
            // 如果生成了结束符或空字符，终止生成
            if (!nextToken || nextToken === '[EOS]' || nextToken === '</s>') {
                break;
            }

            fullResponse += nextToken;
            
            // 更新消息历史，将当前生成的回复作为 assistant 的消息
            promptFinal += nextToken;

            console.log('当前生成:', fullResponse);
        }

        return fullResponse;
    }
}

export default new Model();
