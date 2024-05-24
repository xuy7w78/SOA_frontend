import { createApp } from 'vue' //引用一个方法
import ElementPlus from 'element-plus'
import router from "./router/routes"
import 'element-plus/dist/index.css'
import App from './App.vue' //
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

import urls from "./api/api.js"
app.config.globalProperties.$urls = urls

import request from "./api/request.js"
app.config.globalProperties.$request = request

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    if ("Menu" !== key) {//如果不是图标组件不是Menu，就跳过，否则加上ICon的后缀
        app.component(key, component);
    } else {
        app.component(key + "Icon", component);
    }
}
app.use(ElementPlus)
app.use(router)
app.mount('#app') // # 是指ID
