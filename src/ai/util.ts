

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
