<template>
    <div>404</div>
    <el-button @click="clk">回到主页</el-button>
</template>

<script>
import { getCurrentInstance } from 'vue'

export default {
    name: 'PageError',
    setup(){
        const {proxy} = getCurrentInstance()
        const clk = () =>{
            proxy.$router.push({name:"login_page"})
        }
        return {clk}
    },
}
</script>

<style>

</style>