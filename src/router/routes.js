import { createRouter, createWebHistory} from 'vue-router'
import UploadPDF from "@/components/UploadPDF.vue"
import QuestionPage from "@/components/QuestionPage.vue"
import Page404 from "@/components/Page404.vue"
import LoginPage from "@/components/LoginPage.vue"

const routes = [
    {
        path:"/",
        name:"upload_pdf",
        component:UploadPDF,
    },
    {
        path:"/login",
        name:"login_page",
        component:LoginPage,
    },
    {
        path:"/QA",
        name:"Q_and_A",
        component:QuestionPage,
    },
    {
        path:"/:catchAll(.*)",
        component:Page404,
    }
];

const router = createRouter({
    history:createWebHistory(),
    routes,
})

export default router