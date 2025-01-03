<template>
    <div class="home-view">
        <div class="home-view-left">
            <el-button>Click me</el-button>
        </div>
        <el-divider class="home-view-divider" direction="vertical" />
        <div class="home-view-right">
            <div>{{answer}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {ElButton, ElDivider} from 'element-plus';
import AI from '@/ai';

export default defineComponent({
    name: 'HomeView',
    components: {
        'el-button': ElButton,
        'el-divider': ElDivider,
    },

    data() {
        return {
            answer: '',
        };
    },

    async mounted() {
        await AI.init();
        const result = await AI.chat('你好');
        this.answer = JSON.stringify(result);
    }
});
</script>

<style scoped>
.home-view {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
}

.home-view-left {
    flex: 1;
}

.home-view-divider {
    height: 100%;
    margin: 0;
}

.home-view-right {
    flex: 1;
}
</style>
