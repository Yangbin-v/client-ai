let hasWebGPUFlag: boolean | null = null;

export const hasWebGPU = async () => {
    if (hasWebGPUFlag === null) {
        // @ts-ignore
        if (navigator.gpu) {
            // @ts-ignore
            const adapter = await navigator.gpu.requestAdapter();
            if (adapter.features.has('shader-f16')) {
                hasWebGPUFlag = true;
            }
        }
    }
    return hasWebGPUFlag;
};
