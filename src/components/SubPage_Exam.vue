<template>
  <div>
    <div style="text-align: left; font-size: 12px">
      <el-button @click="quitexam">退出测试</el-button>
    </div>
    <div>
      <el-progress
        :percentage="((Qindx + 1) * 100) / Qlist.length"
        :status="answerstate == 2 ? 'success' : ''"
        :show-text="false"
      />
    </div>
    <div v-if="answerstate == 0">
      <div></div>
      <el-button @click="commitanswer"> 提交答案 </el-button>
    </div>
    <div v-if="answerstate == 1">
      <div></div>
      <el-button v-if="!lastq()" @click="nextq"> 下一题</el-button>
    </div>
    <div v-if="answerstate == 2">
      <div></div>
      <div v-if="roamingpage">
          <el-table
            :data="Qlist"
            style="width: 100%"
            height="500px"
            >
            <el-table-column prop="question_type" label="类型"/>
            <el-table-column prop="passed" label="是否通过"/>
            <el-table-column prop="score" label="分数"/>
          </el-table>
      </div>
      <div v-else>
        <el-button @click="roambk"> 返回统计 </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, toRefs, ref, onMounted } from "vue";
export default {
  name: "SubPage_Exam",
  emits: ["finishExam"],
  setup() {
    const quitexam = () => {
      //clear the local storage of Qlist
      localStorage.setItem("Qlist", "");
      proxy.$emit("finishExam");
    };
    const nextq = () => {
      if (Q_manager.Qindx < Q_manager.Qlist.length) {
        Q_manager.Qindx += 1;
        if (Q_manager.Qlist[Q_manager.Qindx].done == true)
          answerstate.value = 1;
        else answerstate.value = 0;
      }
    };
    const lastq = () => {
      if (Q_manager.Qindx == Q_manager.Qlist.length) return true;
      else return false;
    };
    const commitanswer = () => {
      console.log("commit answer");
      //commit
      const res = { success: true };
      if (res.success) {
        answerstate.value = 1;
        if (Q_manager.Qindx + 1 == Q_manager.Qlist.length) {
          answerstate.value = 2;
          roamingpage.value = true;

          //fetch all answers
        }
      }
    };

    onMounted(() => {
      for (let i = 0; i < Q_manager.Qlist.length; i += 1) {
        if (Q_manager.Qlist[i].done == false) return;
      }
      answerstate.value = 2;
      Q_manager.Qindx = Q_manager.Qlist.length - 1;
      roamingpage.value = true;
    });

    const Q_manager = reactive({
      Qindx: 0,
      Qlist: JSON.parse(localStorage.getItem("Qlist")),
    });
    const { proxy } = getCurrentInstance();
    const answerstate = Q_manager.Qlist[Q_manager.Qindx].done ? ref(1) : ref(0); // 0 => answering, 1 -> show answer, 2 -> goto browse page
    const roamingpage = ref(false);
    return {
      quitexam,
      commitanswer,
      ...toRefs(Q_manager),
      roamingpage,
      answerstate,
      nextq,
      lastq,
    };
  },
};
</script>

<style>
</style>