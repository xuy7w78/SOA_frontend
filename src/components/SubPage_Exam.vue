<template>
  <div>
    <div style="text-align: left; font-size: 12px">
      <el-button @click="quit_exam">退出测试</el-button>
    </div>
    <div>
      <el-progress
        :percentage="((Qindx + 1) * 100) / Qlist.length > 100?100:((Qindx + 1) * 100) / Qlist.length"
        :status="answerstate == 2 ? 'success' : ''"
        :show-text="false"
      />
    </div>
    <div v-if="answerstate == 0" v-loading="loading_ret">
      <div>{{Qlist[Qindx]}}</div>
      <div>
        <el-input placeholder="输入你的答案" type="textarea" v-model="Aanswer">
        </el-input>
      </div>
      <el-button @click="commit_answer"> 提交答案 </el-button>
    </div>
    <div v-if="answerstate == 1" v-loading="loading_ret">
      <div>{{Aret}}</div>
      <el-button v-if="!lastq()" @click="nextq"> 下一题</el-button>
      <el-button v-else @click="goto_roaming">去看结果</el-button>
    </div>
    <div v-if="answerstate == 2">
      <div></div>
      <div v-if="roamingpage">
          <el-table
            :data="Qlist"
            style="width: 100%"
            @row-click="roam_question"
            :row-class-name="rowClassName"
            >
            <!-- <el-table-column type="index" label="题号" width="100"/> -->
            <el-table-column prop="question_type" label="类型"/>
            <el-table-column prop="passed" label="是否通过"/>
            <el-table-column prop="score" label="分数"/>
          </el-table>
      </div>
      <div v-else>
        <div>{{Qlist[Qindx]}}</div>
        <el-button @click="roam_back"> 返回统计 </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, toRefs, ref, onMounted } from "vue";
import { ElMessage } from 'element-plus';
export default {
  name: "SubPage_Exam",
  emits: ["finishExam"],
  props: ["exam_id"],
  setup() {
    const rowClassName = ({row, rowIndex})=>{
      row.index = rowIndex
		}

    const quit_exam = () => {
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
      if (Q_manager.Qindx == Q_manager.Qlist.length - 1) return true;
      else return false;
    };

    const fetchquestions = async (id) => {
      const url = proxy.$urls.names().get_questions;
      const ret = await new proxy.$request(url, { exam_id: id }).myGET(); //请求
      console.log(ret)
      if (ret.success) {
        const Qlist = JSON.stringify(ret.questions);
        localStorage.setItem("Qlist", Qlist);
      } else {
        await Promise.reject();
      }
    };
    const answerquestion = async (qid) => {
      const url = proxy.$urls.names().ans_question;
      let params = {question_id: qid, user_answer: A_manager.Aanswer}
      const ret = await new proxy.$request(url, params).myPOST(); //请求
      if (ret.success) {
        A_manager.Aret = ret
      } else {
        await Promise.reject();
      }
    }

    const commit_answer = () => {
      loading_ret.value = true
      answerquestion(Q_manager.Qlist[Q_manager.Qindx].question_id).then(()=>{
        answerstate.value = 1;
        loading_ret.value = false
      }).catch(()=>{
        loading_ret.value = false
        ElMessage({
          message: "回答失败",
          type: "warning",
        });
      })
    };
    const goto_roaming = ()=>{
      let id = proxy.$props["exam_id"]
      loading_ret.value = true
      fetchquestions(id).then(()=>{
        Q_manager.Qlist = JSON.parse(localStorage.getItem("Qlist"))
        Q_manager.Qindx = Q_manager.Qlist.length
        answerstate.value = 2
        roamingpage.value = true
        loading_ret.value = false
      }).catch(()=>{
        loading_ret.value = false
        ElMessage({
          message: "获取结果失败",
          type: "warning",
        });
      })
    }
    const roam_question = (row) => {
      roamingpage.value = false
      Q_manager.Qindx = row.index
    }
    const roam_back = () =>{
      roamingpage.value = true
      Q_manager.Qindx = Q_manager.Qlist.length
    }

    onMounted(() => {
      Q_manager.Qlist = JSON.parse(localStorage.getItem("Qlist"))
      answerstate.value = 0
      for (let i = 0; i < Q_manager.Qlist.length; i += 1) {
        if (Q_manager.Qlist[i].done == false){
          Q_manager.Qindx = i
          return;
        }
      }
      answerstate.value = 2;
      roamingpage.value = true;
      Q_manager.Qindx = Q_manager.Qlist.length;
    });

    // const exam_id = ref(0)
    const Q_manager = reactive({
      Qindx: 0,
      Qlist: [],
    });
    const A_manager = reactive({
      Aanswer: "",
      Aret: "",
    })
    const { proxy } = getCurrentInstance();
    const answerstate = ref(0); // 0 => answering, 1 -> show answer, 2 -> goto browse page
    const loading_ret = ref(false);
    const roamingpage = ref(false);
    return {
      rowClassName,
      quit_exam,
      commit_answer,
      goto_roaming,
      roam_question,
      roam_back,
      ...toRefs(Q_manager),
      ...toRefs(A_manager),
      // exam_id,
      loading_ret,
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