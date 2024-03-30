import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import './style.css'
import App from './App.vue'

createApp(App)
  .use(ArcoVue)
  .mount('#app')
