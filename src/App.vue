<script setup lang="ts">
import Login from '@/pages/Login/index.vue'
import '@arco-design/web-vue/dist/arco.css';

// import { defineAsyncComponent, type DefineComponent } from 'vue'

// const Login = defineAsyncComponent<DefineComponent>(
//   () => import('./pages/Login/index.vue') as any
// )

</script>

<template>
  <div class="page">
    <Login />
  </div>
</template>

<style scoped>
.page {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>
