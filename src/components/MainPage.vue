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
              <!-- <el-dropdown-item>2</el-dropdown-item>
              <el-dropdown-item>3</el-dropdown-item> -->
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span>{{ account }}</span>
      </div>
    </el-header>

    <el-container>
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu
            class="el-menu-vertical-demo"
            @select="handleSelect"
            :default-active="select.toString()"
          >
            <el-menu-item index="1">
              <el-icon><location /></el-icon>
              <span>文献记录</span>
            </el-menu-item>
            <el-menu-item index="2">
              <el-icon><MenuIcon /></el-icon>
              <span>活跃统计</span>
            </el-menu-item>
            <el-menu-item index="3">
              <el-icon><document /></el-icon>
              <span>用户画像</span>
            </el-menu-item>
            <el-menu-item v-if="examing" index="4">
              <el-icon><setting /></el-icon>
              <span>{{examdone?"查看测试":"正在测试"}}</span>
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-container style="height:600px">
        <el-main>
          <SubPagePDFs v-if="select == '1'" @toExam="toExam"></SubPagePDFs>
          <Page404 v-if="select == '2'" />
          <SubPageProfile v-if="select == '3'" />
          <SubPageExam
            v-if="select == '4'"
            @finishExam="finishExam"
            :exam_id="curexam"
          ></SubPageExam>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { ref, getCurrentInstance} from "vue";
import SubPagePDFs from "./SubPage_PDFs.vue";
import SubPageExam from "./SubPage_Exam.vue";
import SubPageProfile from "./SubPage_Profile.vue";
import Page404 from "./Page404.vue";
import {ElMessage} from "element-plus"
export default {
  name: "MainPage",
  components: {
    SubPagePDFs,
    SubPageExam,
    Page404,
    SubPageProfile,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const account = ref(proxy.$router.currentRoute.value.query.account);
    const select = ref("1");
    const examing = ref(false);
    const examdone = ref(false);
    const curexam = ref("");

    const handleSelect = (key, keyPath) => {
      keyPath;
      if (key != select.value) {
        select.value = key;
      }
      console.log(select.value);
    };
    const logout = async() => {
      //logout
      const url = proxy.$urls.names().logout
      const ret = await new proxy.$request(url).myGET()
      if(ret.success)
        proxy.$router.push({ name: "login_page" });
      else {
        console.log(ret)
        ElMessage({
          message: '登出失败',
          type: 'warning',
        })
      }
    };
    const toExam = (val) => {
      // console.log("parent", val);
      curexam.value = val;
      select.value = 4;
      examing.value = true;
    };
    const finishExam = () => {
      select.value = 1;
      examing.value = false;
    };


    return {
      account,
      select,
      examing,
      examdone,
      handleSelect,
      logout,
      toExam,
      finishExam,
      curexam,
    };
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