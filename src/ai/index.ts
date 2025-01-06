import * as ort from 'onnxruntime-web';
import {getModelInput} from './util';

/** 模型 */
class Model {
    // @ts-expect-error TextGenerationPipeline 允许缺省
    private session: ort.InferenceSession;

    async init() {
        this.session = await ort.InferenceSession.create('./model/model.onnx');
    }

    async chat(prompt: string) {
        if (!this.session) {
            await this.init();
        }

        const inputData = await getModelInput(prompt);

        const result = await this.session.run(inputData);

        return result;
    }
}

export default new Model();
