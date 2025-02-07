<template>
    <div class="chat-avator">
        <img :src="avatar" alt="avatar" class="chat-avator-avatar-img" />
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
    name: 'ChatAvator',
    props: {
        avatar: {
            type: String,
            required: true,
        }
    },
});
</script>

<style scoped>
.chat-avator {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ccc;

    .chat-avator-avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
}
</style>
