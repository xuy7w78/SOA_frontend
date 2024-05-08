import { createApp } from 'vue' //引用一个方法
import ElementPlus from 'element-plus'
import router from "./router/routes"
import 'element-plus/dist/index.css'
import App from './App.vue' //

const app = createApp(App)

import urls from "./api/api.js"
app.config.globalProperties.$urls = urls

import request from "./api/request.js"
app.config.globalProperties.$request = request

app.use(ElementPlus)
app.use(router)
app.mount('#app') // # 是指ID
