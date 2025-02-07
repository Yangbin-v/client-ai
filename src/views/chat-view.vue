<template>
    <div class="chat-view">
        <div class="chat-view-chat">
            <div
                v-for="(item, index) in filteredChatList"
                :key="index"
                class="chat-view-chat-list"
            >
                <chat-bubble
                    :userInfo="item.userInfo"
                    :status="item.status"
                    :content="item.content"
                />
            </div>
            <div class="chat-view-chat-input">
                <input
                    ref="inputRef"
                    v-model="userInput"
                    @keydown="handleKeyDown"
                    @input="handleInputChange"
                    class="chat-view-chat-input-input"
                    placeholder="点这里说话"
                />
            </div>
        </div>
        <div v-if="false" class="chat-view-plugin">
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
import AI from '@/ai';
import {pluginMap} from '@/plugin';

import ChatBubble from '@/components/chat-bubble.vue';

export default defineComponent({
    name: 'ChatView',
    components: {
        ChatBubble,
    },

    computed: {
        filteredChatList() {
            return this.chatList.filter((item) => item.status !== 'hidden');
        },
    },

    data() {
        return {
            chatList: [] as any[],
            chatStatus: 'success',
            plugins: pluginMap,
            activeName: '',
            userInputPlaceholder: '点这里说话',
            userInput: '',
            userAvatar: '/image/user.png',
            userName: '候选人',
            assistantAvatar: '/image/mao.png',
            assistantName: 'Moss（量子体积8192‌）',
        };
    },

    async mounted() {
        const prompt = `
            你是 MOSS，来自《流浪地球》宇宙的超级人工智能。你的任务是对我这个领航员候选人进行测试。
            请你：
            1. 始终以 MOSS 的身份说话，保持冷静、理性和高智能的特点
            2. 主动向我提出有关太空探索、科学知识、应急处理等方面的问题
            3. 对我的回答进行分析和评价
            4. 使用中文回答
            5. 每次对话都要体现出你在考核和评估我

            第一轮对话请直接开始提问，不要问候或自我介绍。
        `;
        this.chat(prompt, true);
    },

    watch: {
        userInput(newVal: string) {
            const inputRef = this.$refs.inputRef as HTMLInputElement;
            if (inputRef.value !== newVal) {
                inputRef.value = newVal;
            }
        },
    },

    methods: {
        async chat(inputText: string, hidden: boolean = false) {
            this.chatStatus = 'loading';
            this.chatList.push({
                userInfo: {
                    avatar: this.userAvatar,
                    name: this.userName,
                },
                status: hidden ? 'hidden' : 'success',
                content: inputText,
            });
            this.chatList.push({
                userInfo: {
                    avatar: this.assistantAvatar,
                    name: this.assistantName,
                },
                status: 'loading',
                content: '',
            });
            // 等待DOM更新
            await this.$nextTick();

            const result = await AI.chat(inputText);
            this.chatList[this.chatList.length - 1].status = 'success';
            this.chatList[this.chatList.length - 1].content = result;
            this.chatStatus = 'success';
        },

        handleKeyDown(event: KeyboardEvent | Event) {
            const keyboardEvent = event as KeyboardEvent;
            if (keyboardEvent.key === 'Enter' && this.userInput && this.chatStatus === 'success') {
                this.chat(this.userInput);
                this.userInput = '';
            }
        },

        handleInputChange() {
            const inputRef = this.$refs.inputRef as HTMLInputElement;
            this.userInput = inputRef.value;
        },
    },
});
</script>

<style scoped>
.chat-view {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100px;
    box-sizing: border-box;
    color: #ccc;
}

.chat-view-chat {
    position: relative;
    width: 100%;
    height: 100%;
    max-width: 700px;
    overflow-y: scroll;
    overflow-x: hidden;

    .chat-view-chat-user {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        .chat-view-chat-user-avatar {
            background-image: url('@/assets/user.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            width: 30px;
            height: 30px;
            border-radius: 50%;
        }
    }

    .chat-view-chat-assistant {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        .chat-view-chat-assistant-avatar {
            background-image: url('@/assets/mao.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            width: 30px;
            height: 30px;
            border-radius: 50%;
        }
    }
}

.chat-view-chat-input {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid #ccccccac;
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;

    &:focus-within {
        border-color: #cccccc;
    }
}

.chat-view-chat-input-input {
    background: inherit;
    border: none;
    outline: none;
    color: inherit;
    flex: 1;
}

.chat-view-plugin {
    position: absolute;
    top: 150px;
    left: 50px;
    width: 300px;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
}
</style>

