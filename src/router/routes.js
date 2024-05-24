import { createRouter, createWebHistory} from 'vue-router'
// import UploadPDF from "@/components/UploadPDF.vue"
// import QuestionPage from "@/components/QuestionPage.vue"
import MainPage from "@/components/MainPage.vue"
import PageError from "@/components/Page404.vue"
import LoginPage from "@/components/LoginPage.vue"

const routes = [
    {
        path:"/login",
        name:"login_page",
        component:LoginPage,
    },
    {
        path:"/main",
        name:"main_page",
        component:MainPage,
    },
    {
        path:"/:catchAll(.*)",
        component:PageError,
    }
];

const router = createRouter({
    history:createWebHistory(),
    routes,
})

export default router