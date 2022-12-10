import { createApp } from 'vue'
import { createPinia } from 'pinia'

const pinia = createPinia

import App from './App.vue'
import store from "./store";
import router from "./router/router";

const app = createApp(App)

import './style.css'

app.use(pinia)

app.use(store)

app.use(router)

app.mount('#app')
