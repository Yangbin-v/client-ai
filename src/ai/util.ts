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
