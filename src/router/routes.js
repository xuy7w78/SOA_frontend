import { createRouter, createWebHistory} from 'vue-router'
import MainPage from "@/components/MainPage.vue"
import PageError from "@/components/Page404.vue"
import LoginPage from "@/components/LoginPage.vue"
import SubPage_PDFs from "@/components/SubPage_PDFs.vue"
import SubPage_Profile from "@/components/SubPage_Profile.vue"

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
        path:"/debug_pdfs",
        name:"debug_pdfs",
        component:SubPage_PDFs,
    },
    {
        path:"/debug_profile",
        name:"debug_profile",
        component:SubPage_Profile,
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