<template>
    <div class="chat-bubble">
        <chat-avator class="chat-bubble-avator" :avatar="userInfo.avatar" />
        <div class="chat-bubble-content">
            <div class="chat-bubble-info">
                <div class="chat-bubble-info-name">
                    {{userInfo.name}}
                </div>
            </div>
            <div v-if="status === 'success'" class="chat-bubble-content-text">
                {{content}}
            </div>
            <div v-else class="chat-bubble-loading">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent, type PropType} from 'vue';

import ChatAvator from '@/components/chat-avator.vue';

export default defineComponent({
    components: {
        ChatAvator,
    },
    props: {
        content: {
            type: String,
            required: true,
        },
        userInfo: {
            type: Object as PropType<{
                avatar: string;
                name: string;
            }>,
            required: true,
        },
        status: {
            type: String as PropType<'loading' | 'success' | 'error'>,
            required: true,
        },
    },
});
</script>

<style scoped>
.chat-bubble {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    margin-bottom: 15px;
}

.chat-bubble-avator {
    margin-top: 1px;
    flex: none;
}

.chat-bubble-content {
    margin-left: 8px;
    flex: 1;
}

.chat-bubble-info-name {
    font-size: 12px;
    line-height: 14px;
    color: #999;
}

@keyframes flashAnimation {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

.chat-bubble-loading {
    margin-top: 4px;
    width: 12px;
    height: 12px;
    background-color: #6c9aff;
    border-radius: 50%;
    animation: flashAnimation 1s linear infinite;
}
</style>
