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

        const inputData = await getModelInput(prompt);

        const outputs = await this.session.run(inputData);
        console.log('outputs', outputs);

        // @ts-ignore
        const text = await decodeOutput(outputs);
        console.log('生成的文本:', text);

        return text;
    }
}

export default new Model();
