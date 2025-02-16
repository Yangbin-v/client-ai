

let canUseWebGPUFlag = 0;

/** 是否支持 WebGPU */
export const hasWebGPU = async() => {
    if (canUseWebGPUFlag === 0) {
        // @ts-expect-error 忽略类型检查
        if (navigator.gpu) {
            // @ts-expect-error 忽略类型检查
            const adapter = await navigator.gpu.requestAdapter();
            if (adapter.features.has('shader-f16')) {
                canUseWebGPUFlag = 1;
            }
            else {
                canUseWebGPUFlag = -1;
            }
        }
        else {
            canUseWebGPUFlag = -1;
        }
    }
    return canUseWebGPUFlag;
};
