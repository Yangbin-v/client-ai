import {Tensor} from 'onnxruntime-web';
import {PreTrainedTokenizer} from '@huggingface/transformers';
// import {ModelInputs} from './interface';

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

/**
 * 准备模型输入数据
 * @param inputIds 分词结果
 * @returns 模型输入数据，张量
 */
export async function prepareInput(text: string) {
    const inputIds = await tokenizer(text);
    const attentionMask = inputIds.map(id => (id > 0 ? 1 : 0));
    const bigIntArray = inputIds.map(id => BigInt(id));
    const inputTensor = new Tensor('int64', new BigInt64Array(bigIntArray), [1, inputIds.length]);
    const attentionMaskArray = attentionMask.map(mask => BigInt(mask));
    const attentionMaskTensor = new Tensor('int64', new BigInt64Array(attentionMaskArray), [1, inputIds.length]);
    return {input_ids: inputTensor, attention_mask: attentionMaskTensor};
}
