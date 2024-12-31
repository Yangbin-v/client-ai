<template>
    <h1>初始化完成！{{ name }}</h1>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api';

export default defineComponent({
    name: 'HelloWorld',

    data() {
        return {
            name: 'HelloWorld',
        };
    },
});
</script>

<style scoped lang="less">
h1 {
    padding-left: .5em;
}
</style>
