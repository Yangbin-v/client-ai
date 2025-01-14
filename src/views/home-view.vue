<template>
    <div class="home-view">
        <el-input
            v-model="userInput"
            style="max-width: 600px"
            placeholder="Please input"
        >
            <template #append>
                <el-button @click="chat">chat</el-button>
            </template>
        </el-input>
        <div class="home-view-answer">
            <div>{{answer}}</div>
        </div>
        <div class="home-view-plugin">
            <el-collapse v-model="activeName" accordion>
                <el-collapse-item
                    v-for="item in plugins"
                    :title="item.name"
                    :name="item.id"
                    :key="item.id"
                >
                    <div>{{item.name}} - {{item.description}}</div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {ElButton, ElInput} from 'element-plus';
import AI from '@/ai';
import {pluginMap} from '@/plugin';
export default defineComponent({
    name: 'HomeView',
    components: {
        'el-button': ElButton,
        'el-input': ElInput,
    },

    data() {
        return {
            answer: '',
            userInput: '',
            plugins: pluginMap,
            activeName: '',
        };
    },

    async mounted() {
        await AI.init();
        const result = await AI.chat('hello, how are you?');
        this.answer = JSON.stringify(result);
    },

    methods: {
        async chat() {
            
        },
    },
});
</script>

<style scoped>
.home-view {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100px 400px;
    box-sizing: border-box;
}

.home-view-answer {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.home-view-plugin {
    position: absolute;
    top: 150px;
    left: 50px;
    width: 300px;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
}
</style>

