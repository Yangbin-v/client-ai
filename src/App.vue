<template>
    <div id="app">
        <hello-world/>
        <div>{{ message }}</div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from '@vue/composition-api';
import HelloWorld from './components/HelloWorld.vue';
import AI from '@/ai';
export default defineComponent({
    name: 'App',
    data() {
        return {
            message: '...',
        };
    },
    components: {
        HelloWorld,
    },
    async mounted() {
        const result = await AI.chat('你是谁?介绍一下自己');
        this.message = JSON.stringify(result);
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
