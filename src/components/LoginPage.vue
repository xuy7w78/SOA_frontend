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
import {ElMessage} from "element-plus"
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
      const url = proxy.$urls.names().login
      const loginjson = {username:account.value, password:password.value}
      const ret = await new proxy.$request(url, loginjson).myPOST()
      if(ret.success){
          proxy.$router.push({name:"main_page", query:{account:account.value}})
      }
      else{
          console.log(ret)
          ElMessage({
              message: '登录失败',
              type: 'warning',
          })
      }
      
    }
    const click_register = async()=>{
      change_mode()
      const url = proxy.$urls.names().register
      const registerjson = {username:account.value, password:password.value, email: "thu@qq.com"}
      const ret = await new proxy.$request(url, registerjson).myPOST()

      if(ret.success){
          proxy.$router.push({name:"main_page", query:{account:account.value}})
      }
      else{
          console.log(ret)
          ElMessage({
              message: '注册失败',
              type: 'warning',
          })
      }
    }
    return {account, password, islogin, change_mode, click_login, click_register}
  }
}
</script>

<style>

</style>