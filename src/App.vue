<template>
    <div id="app">
        <div>{{ question }}</div>
        <div>{{ message }}</div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api';
import AI from '@/ai';
export default defineComponent({
    name: 'App',
    data() {
        return {
            question: '给我生成一个小学数学题',
            message: '...',
        };
    },
    components: {},
    mounted() {
        AI.chat(this.question).then(result => {
            this.message = JSON.stringify(result);
        });
    },
});
</script>

<style lang="less">
body {
    margin: 0;
}

#app {
    font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        "Helvetica Neue",
        Arial,
        "PingFang SC",
        "Hiragino Sans GB",
        "Microsoft YaHei",
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 80px;
}

.logo {
    margin-bottom: 30px;
}
</style>
