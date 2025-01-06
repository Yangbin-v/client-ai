import {Tensor} from 'onnxruntime-web';
import {PreTrainedTokenizer} from '@huggingface/transformers';

let hasWebGPUFlag: boolean | null = null;

/** 是否支持 WebGPU */
export const hasWebGPU = async() => {
    if (hasWebGPUFlag === null) {
        // @ts-expect-error WebGPU API 类型尚未完全支持
        if (navigator.gpu) {
            // @ts-expect-error WebGPU API 类型尚未完全支持
            const adapter = await navigator.gpu.requestAdapter();
            if (adapter.features.has('shader-f16')) {
                hasWebGPUFlag = true;
            }
        }
    }
    return hasWebGPUFlag;
};

let tokenizerInstance: PreTrainedTokenizer | null = null;
/**
 * 初始化分词器
 */
async function initTokenizer() {
    if (!tokenizerInstance) {
        // 加载 tokenizer.json 和 config.json
        const [tokenizerJSON, tokenizerConfig] = await Promise.all([
            fetch('./model/tokenizer.json').then(r => r.json()),
            fetch('./model/tokenizer_config.json').then(r => r.json()),
        ]);
        tokenizerInstance = new PreTrainedTokenizer(tokenizerJSON, tokenizerConfig);
    }
    return tokenizerInstance;
}

/**
 * 对输入文本进行分词
 * @param text 输入文本
 * @returns 分词后的结果
 */
async function tokenizer(text: string) {
    const tokenizer = await initTokenizer();
    const tokens = tokenizer.encode(text);
    console.log('分词结果', tokens);
    return tokens;
}

export async function getModelInput(prompt: string) {
    const inputIds = await tokenizer(prompt);
    const attentionMask = inputIds.map(id => (id > 0 ? 1 : 0));
    const bigIntArray = inputIds.map(id => BigInt(id));
    const inputTensor = new Tensor('int64', new BigInt64Array(bigIntArray), [1, inputIds.length]);
    const attentionMaskArray = attentionMask.map(mask => BigInt(mask));
    const attentionMaskTensor = new Tensor('int64', new BigInt64Array(attentionMaskArray), [1, inputIds.length]);
    return {input_ids: inputTensor, attention_mask: attentionMaskTensor};
}
