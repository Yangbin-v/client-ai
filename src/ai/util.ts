import {Tensor} from 'onnxruntime-web';
import {PreTrainedTokenizer, AutoTokenizer} from '@huggingface/transformers';

let hasWebGPUFlag: boolean | null = null;

/** 是否支持 WebGPU */
export const hasWebGPU = async() => {
    if (hasWebGPUFlag === null) {
        // @ts-expect-error 忽略类型检查
        if (navigator.gpu) {
            // @ts-expect-error 忽略类型检查
            const adapter = await navigator.gpu.requestAdapter();
            if (adapter.features.has('shader-f16')) {
                hasWebGPUFlag = true;
            }
        }
    }
    return hasWebGPUFlag;
};

export let tokenizerInstance: PreTrainedTokenizer | null = null;
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
export async function tokenizeMessages(messages: Array<{role: string; content: string}>) {
    const tokenizer = await initTokenizer();
    const tokens = tokenizer.apply_chat_template(
        messages,
        {
            chat_template: '{% for message in messages %}<|im_start|>{{ message.role }}\n{{ message.content }}<|im_end|>\n{% endfor %}{% if add_generation_prompt %}<|im_start|>assistant\n{% endif %}',
            tokenize: false,
            add_generation_prompt: true
        }
    );
    console.log('分词结果', tokens);
    return tokens;
}

export async function getModelInput(messages: string) {
    const inputIds = tokenizerInstance.encode(messages);
    const seqLength = inputIds.length;

    // 1. 构造 input_ids
    const bigIntArray = inputIds.map(id => BigInt(id));
    const inputTensor = new Tensor('int64', new BigInt64Array(bigIntArray), [1, seqLength]);

    // 2. 构造 attention_mask 
    const attentionMask = inputIds.map(() => 1);
    const attentionMaskTensor = new Tensor('int64', new BigInt64Array(attentionMask.map(m => BigInt(m))), [1, seqLength]);

    // 3. 构造 position_ids
    const positionIds = Array.from({length: seqLength}, (_, i) => i);
    const positionTensor = new Tensor('int64', new BigInt64Array(positionIds.map(p => BigInt(p))), [1, seqLength]);

    // 4. 构造 past_key_values
    const numLayers = 30;
    const hiddenSize = 576;
    const numKVHeads = 3;
    const headDim = hiddenSize / 9;

    const past_key_values: Record<string, Tensor> = {};
    for (let i = 0; i < numLayers; i++) {
        // 为每一层创建 key 和 value tensor
        past_key_values[`past_key_values.${i}.key`] = new Tensor(
            'float32',
            new Float32Array(1 * numKVHeads * 0 * headDim), // 初始为空
            [1, numKVHeads, 0, headDim]
        );

        past_key_values[`past_key_values.${i}.value`] = new Tensor(
            'float32',
            new Float32Array(1 * numKVHeads * 0 * headDim), // 初始为空
            [1, numKVHeads, 0, headDim]
        );
    }

    return {
        input_ids: inputTensor,
        attention_mask: attentionMaskTensor,
        position_ids: positionTensor,
        ...past_key_values
    };
}

/**
 * 将模型输出转换为文本
 * @param output 模型输出
 * @returns 生成的文本
 */
export async function decodeOutput(output: {logits: Tensor}) {
    // 获取 logits tensor
    const logits = output.logits;
    const logitsData = logits.data as Float32Array;
    const [batchSize, seqLen, vocabSize] = logits.dims;

    // 获取最后一个位置的 logits
    const lastLogits = logitsData.slice(-vocabSize);

    // 应用温度
    const temperature = 0.7; // 可调整的温度参数，越大随机性越强
    const scaledLogits = lastLogits.map(logit => logit / temperature);

    // 计算 softmax
    const maxLogit = Math.max(...scaledLogits);
    const expLogits = scaledLogits.map(logit => Math.exp(logit - maxLogit));
    const expSum = expLogits.reduce((a, b) => a + b, 0);
    const probs = expLogits.map(exp => exp / expSum);

    // 使用轮盘赌选择采样
    const random = Math.random();
    let cumulativeProb = 0;
    let nextTokenId = 0;

    for (let i = 0; i < probs.length; i++) {
        cumulativeProb += probs[i];
        if (random <= cumulativeProb) {
            nextTokenId = i;
            break;
        }
    }

    // 使用 tokenizer 解码
    const tokenizer = await initTokenizer();
    console.log('nextTokenId', nextTokenId);
    const text = tokenizer.decode([BigInt(nextTokenId)]);

    return text;
}
