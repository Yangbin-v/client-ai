<template>
    <router-view />
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {RouterView} from 'vue-router';

export default defineComponent({
    components: {
        'router-view': RouterView
    }
});
</script>

<style scoped>
#app {
    width: 100vw;
    height: 100vh;
}
</style>
