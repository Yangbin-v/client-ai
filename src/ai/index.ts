import * as ort from 'onnxruntime-web';
import {getModelInput, decodeOutput} from './util';

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

        console.log('必要输入', this.session.inputNames);

        let currentPrompt = prompt;
        let fullResponse = '';

        // 最大生成长度限制，防止无限循环
        const MAX_LENGTH = 500;

        while (fullResponse.length < MAX_LENGTH) {

            const inputData = await getModelInput(currentPrompt);

            const outputs = await this.session.run(inputData);
            console.log('outputs', outputs);

            // @ts-expect-error TextGenerationPipeline 允许缺省
            const nextToken = await decodeOutput(outputs);
            // 如果生成了结束符或空字符，终止生成
            if (!nextToken || nextToken === '[EOS]' || nextToken === '</s>') {
                break;
            }

            fullResponse += nextToken;
            // 更新提示，包含之前的上下文
            currentPrompt = prompt + fullResponse;
            console.log('当前生成:', fullResponse);
        }

        return fullResponse;
    }
}

export default new Model();
