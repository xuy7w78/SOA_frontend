import { createRouter, createWebHistory} from 'vue-router'
import MainPage from "@/components/MainPage.vue"
import PageError from "@/components/Page404.vue"
import LoginPage from "@/components/LoginPage.vue"
import SubPage_PDFs from "@/components/SubPage_PDFs.vue"
import SubPage_Profile from "@/components/SubPage_Profile.vue"
// import SubPage_Radar from "@/components/SubPage_Radar.vue"
import SubPage_Calendar from "@/components/SubPage_Calendar.vue"

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
        path:"/debug_radar",
        name:"debug_radar",
        component:SubPage_Profile,
    },
    {
        path:"/debug_calendar",
        name:"debug_calendar",
        component:SubPage_Calendar,
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