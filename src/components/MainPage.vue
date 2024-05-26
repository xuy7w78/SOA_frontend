<template>
  <el-container class="layout-container" style="height: 500px">
    <el-header style="text-align: right; font-size: 12px">
      <div class="toolbar">
        <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout">登出</el-dropdown-item>
                <el-dropdown-item>2</el-dropdown-item>
                <el-dropdown-item>3</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        <span>{{ account }}</span>
      </div>
    </el-header>

    <el-container>
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu class="el-menu-vertical-demo" @select="handleSelect" >
            <el-menu-item index="1">
              <template #title>
                <el-icon><location /></el-icon>
                <span>测试页面</span>
              </template>
            </el-menu-item>
            <el-menu-item index="2">
              <el-icon><MenuIcon /></el-icon>
              <span>历史文献</span>
            </el-menu-item>
            <el-menu-item index="3">
              <el-icon><document /></el-icon>
              <span>用户画像</span>
            </el-menu-item>
            <el-menu-item index="4">
              <el-icon><setting /></el-icon>
              <span></span>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-container>
        <el-main>
          <SubPagePDFs v-if="select == 1" @toExam="toExam"></SubPagePDFs>
          <Page404 v-if="select == 2" />
          <Page404 v-if="select == 3" />
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import SubPagePDFs from "./SubPage_PDFs.vue";
import Page404 from "./Page404.vue";
export default {
  name: "MainPage",
  components: {
    SubPagePDFs,
    Page404,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const account = ref(proxy.$router.currentRoute.value.query.account);
    const select = ref(1);
    
    const handleSelect = (key, keyPath) => {
      keyPath;
      if (key != select.value) {
        select.value = key;
      }
      console.log(select.value);
    };
    const logout = ()=>{
      //logout
      proxy.$router.push({name:"login_page"})
    }
    const toExam=(val)=>{
      console.log("parent", val)
      select.value = 4
    }

    return { account, select, handleSelect, logout, toExam};
  },
};
</script>

<style scoped>
.layout-container .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container .el-menu {
  border-right: none;
}
.layout-container .el-main {
  padding: 0;
}
.layout-container .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>