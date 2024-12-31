import {InferenceSession, Tensor} from 'onnxruntime-web';

export interface ModelInputs extends InferenceSession.FeedsType {
    // 文本输入
    input_ids: Tensor;
    attention_mask: Tensor;
    position_ids: Tensor;
    // past_key_values: Record<string, Tensor>
    // 图像输入
    pixel_values: Tensor;
    image_grid_thw: Tensor;
}
