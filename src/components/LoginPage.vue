<template>
  <div>
    <div>
      登录  界面
    </div>
    <div>
      <p>账号：<el-input v-model="account"></el-input></p>
      <p>密码：<el-input v-model="password" type="password" show-password></el-input></p>
    </div>
    <div>
      <el-button v-if="islogin" @click="click_login">登录</el-button>
      <el-button v-else @click="click_register">注册</el-button>
      <el-button @click="change_mode">{{islogin?"去注册":"去登录"}}</el-button>
    </div>
  </div>
</template>

<script>
import {ref, getCurrentInstance} from 'vue'

export default {
  name:"LoginPage",
  setup(){
    const account = ref("")
    const password = ref("")
    const islogin = ref(true)
    const {proxy} = getCurrentInstance()
    const change_mode = ()=>{
      islogin.value = !islogin.value
    }
    const click_login = async()=>{
      proxy.$router.push({name:"main_page", query:{account:account.value}})
    }
    const click_register = async()=>{
      change_mode()
    }
    return {account, password, islogin, change_mode, click_login, click_register}
  }
}
</script>

<style>

</style>