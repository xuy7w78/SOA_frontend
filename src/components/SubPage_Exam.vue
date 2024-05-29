<template>
  <div>
    <div style="text-align: left; font-size: 12px">
      <el-button @click="quit_exam">退出测试</el-button>
    </div>
    <div>
      <el-progress
        :percentage="
          ((Qindx + 1) * 100) / Qlist.length > 100
            ? 100
            : ((Qindx + 1) * 100) / Qlist.length
        "
        :status="answerstate == 2 ? 'success' : ''"
        :show-text="false"
      />
    </div>
    <div v-if="answerstate == 0" v-loading="loading_ret">
      <div>
      </div>
      <div>
        <el-descriptions
          :column="3"
          border
        >
          <el-descriptions-item label="类型">{{question_type_translate(Qlist[Qindx].question_type)}}</el-descriptions-item>
          <el-descriptions-item label="说明" span="2">{{question_type_descriptn(Qlist[Qindx].question_type)}}</el-descriptions-item>
          <el-descriptions-item label="题目" span="3">{{Qlist[Qindx].question_content}}</el-descriptions-item>
        </el-descriptions>
        <el-input placeholder="输入你的答案" type="textarea" v-model="Aanswer">
        </el-input>
      </div>
      <el-button @click="commit_answer"> 提交答案 </el-button>
    </div>
    <div v-if="answerstate == 1" v-loading="loading_ret">
      <el-descriptions
          :column="3"
          border
        >
          <el-descriptions-item label="类型">{{question_type_translate(Qlist[Qindx].question_type)}}</el-descriptions-item>
          <el-descriptions-item label="分数">{{Aret.score_translated}}</el-descriptions-item>
          <el-descriptions-item label="通过">{{Aret.passed_translated}}</el-descriptions-item>
          <el-descriptions-item label="题目" span="3">{{Qlist[Qindx].question_content}}</el-descriptions-item>
          <el-descriptions-item label="你的答案" span="3">{{Aanswer}}</el-descriptions-item>
          <el-descriptions-item label="参考答案" span="3">{{Aret.standard_answer}}</el-descriptions-item>
          <el-descriptions-item label="解析" span="3">{{Aret.review}}</el-descriptions-item>
      </el-descriptions>
      
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
          :row-style="rowStyle"
        >
          <!-- <el-table-column type="index" label="题号" width="100"/> -->
          <el-table-column prop="question_type_translated" label="题目类型" />
          <el-table-column prop="passed_translated" label="是否通过" />
          <el-table-column prop="score_translated" label="分数" />
        </el-table>
      </div>
      <div v-else>
        <el-descriptions
          :column="3"
          border
        >
          <el-descriptions-item label="类型">{{Qlist[Qindx].question_type_translated}}</el-descriptions-item>
          <el-descriptions-item label="分数">{{Qlist[Qindx].score_translated}}</el-descriptions-item>
          <el-descriptions-item label="通过">{{Qlist[Qindx].passed_translated}}</el-descriptions-item>
          <el-descriptions-item label="题目" span="3">{{Qlist[Qindx].question_content}}</el-descriptions-item>
          <el-descriptions-item label="你的答案" span="3">{{Qlist[Qindx].user_answer}}</el-descriptions-item>
          <el-descriptions-item label="参考答案" span="3">{{Qlist[Qindx].standard_answer}}</el-descriptions-item>
          <el-descriptions-item label="解析" span="3">{{Qlist[Qindx].review}}</el-descriptions-item>
        </el-descriptions>
        <!-- <div>{{ Qlist[Qindx] }}</div> -->
        <el-button @click="roam_back"> 返回统计 </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, toRefs, ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
export default {
  name: "SubPage_Exam",
  emits: ["finishExam"],
  props: ["exam_id"],
  setup() {
    const rowClassName = ({ row, rowIndex }) => {
      row.index = rowIndex;
      let type = row.question_type;
      row.question_type_translated =
        type == 0 ? "选择" : type == 1 ? "判断" : type == 2 ? "填空" : "论述";
      let passed = row.passed;
      row.passed_translated = passed ? "通过" : "不通过";
      let score = row.score;
      row.score_translated = String(score) + "/100";
    };
    const rowStyle = (val) => {
      if (val.row.passed)
        return {
          backgroundColor: "#EEFFBB",
          color: "#000",
        };
    };

    const question_type_translate = (type)=>{
      return type == 0 ? "选择" : type == 1 ? "判断" : type == 2 ? "填空" : "论述";
    }
    const question_type_descriptn = (type)=>{
      return type == 0 ? "选择题，请回答A，B，C或D" : 
             type == 1 ? "判断题，请回答正确或错误" : 
             type == 2 ? "填空题，请填写空缺的部分" : "论述题，请论述本问题";
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
      if (ret.success) {
        const Qlist = JSON.stringify(ret.questions);
        localStorage.setItem("Qlist", Qlist);
      } else {
        await Promise.reject();
      }
    };
    const answerquestion = async (qid) => {
      const url = proxy.$urls.names().ans_question;
      let params = { question_id: qid, user_answer: A_manager.Aanswer };
      const ret = await new proxy.$request(url, params).myPOST(); //请求
      if (ret.success) {
        A_manager.Aret = ret;
        let score = ret.score;
        A_manager.Aret.score_translated = String(score) + "/100";
        let passed = ret.passed;
        A_manager.Aret.passed_translated = passed ? "通过" : "不通过";
      } else {
        await Promise.reject();
      }
    };

    const commit_answer = () => {
      loading_ret.value = true;
      answerquestion(Q_manager.Qlist[Q_manager.Qindx].question_id)
        .then(() => {
          answerstate.value = 1;
          loading_ret.value = false;
          Q_manager.Qlist[Q_manager.Qindx].done = true;
          localStorage.setItem("Qlist", JSON.stringify(Q_manager.Qlist));
        })
        .catch(() => {
          loading_ret.value = false;
          ElMessage({
            message: "回答失败",
            type: "warning",
          });
        });
    };
    const goto_roaming = () => {
      let id = proxy.$props["exam_id"];
      loading_ret.value = true;
      fetchquestions(id)
        .then(() => {
          Q_manager.Qlist = JSON.parse(localStorage.getItem("Qlist"));
          Q_manager.Qindx = Q_manager.Qlist.length;
          answerstate.value = 2;
          roamingpage.value = true;
          loading_ret.value = false;
        })
        .catch(() => {
          loading_ret.value = false;
          ElMessage({
            message: "获取结果失败",
            type: "warning",
          });
        });
    };
    const roam_question = (row) => {
      roamingpage.value = false;
      Q_manager.Qindx = row.index;
    };
    const roam_back = () => {
      roamingpage.value = true;
      Q_manager.Qindx = Q_manager.Qlist.length;
    };

    onMounted(() => {
      Q_manager.Qlist = JSON.parse(localStorage.getItem("Qlist"));
      answerstate.value = 0;
      for (let i = 0; i < Q_manager.Qlist.length; i += 1) {
        if (Q_manager.Qlist[i].done == false) {
          Q_manager.Qindx = i;
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
    });
    const { proxy } = getCurrentInstance();
    const answerstate = ref(-1); // 0 => answering, 1 -> show answer, 2 -> goto browse page
    const loading_ret = ref(false);
    const roamingpage = ref(false);
    return {
      rowClassName,
      rowStyle,
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
      question_type_descriptn,
      question_type_translate,
      nextq,
      lastq,
    };
  },
};
</script>

<style>
</style>