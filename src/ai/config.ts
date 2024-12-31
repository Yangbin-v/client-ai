import {env} from '@huggingface/transformers';

/** 模型配置 */
const modelConfig = {
    modelPath: './model/onnx/model_int8.onnx',
};

export const initTransformersEnv = () => {
    env.allowRemoteModels = false;
    env.allowLocalModels = true;
    env.localModelPath = './model';
    if (env.backends.onnx.wasm) {
        env.backends.onnx.wasm.wasmPaths = './wasm/';
    }
};

export type ModelConfig = typeof modelConfig;
