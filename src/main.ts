import { createApp } from 'vue';
import App from './App.vue';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { createPinia } from 'pinia';
import router from '@/router'
import { useAuthStore } from "@/store/authCodeStore";

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;

const pinia = createPinia();

createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app');

    
const { setAuthCode } = useAuthStore()
setAuthCode("2222")