<template>
  <div>
    <div style="text-align: left; font-size: 12px">
      <el-button @click="visible_uploadPDF = true">添加文献</el-button>
      <el-button @click="recommend_drawer = true">推荐文献</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="PDFlist"
      style="width: 100%"
      height="500px"
      @row-click="openexamlist"
    >
      <el-table-column prop="createtime" label="createTime" width="200" />
      <el-table-column prop="title" label="Title" />
    </el-table>
  </div>
  <div>
    <el-pagination
      v-model:current-page="current_page"
      :total="total_page * 10"
      hide-on-single-page
      layout="prev, pager, next, jumper"
      @current-change="pagechanged"
    />
  </div>
  <el-dialog v-model="visible_uploadPDF" title="添加PDF" width="500">
    <template #footer>
      <div class="dialog-footer">
        <div style="padding: 20">
          <el-input v-model="linker" placeholder="上传论文下载链接" />
        </div>
        <div></div>
        <div>
          <el-button
            @click="click_upload"
            :loading="is_uploading"
            :disabled="linker == ''"
            >上传</el-button
          >
        </div>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="visible_currentPDF" :title="PDFtitle">
    <el-scrollbar>
      <el-table
        v-loading="loading_exams"
        :data="examlist"
        style="width: 100%"
        height="300"
        @row-click="toExam"
        :row-style="colorexam"
      >
        <el-table-column prop="createtime" label="createTime" width="200" />
        <el-table-column prop="state" label="state" />
      </el-table>
    </el-scrollbar>
    <el-button @click="gennewExam" :disabled="loading_exams"
      >生成新测试</el-button
    >
  </el-dialog>

  <el-drawer v-model="recommend_drawer" title="RECOMMENDATIONS" direction="rtl">
  </el-drawer>
</template>

<script>
import { reactive, toRefs, ref, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";

export default {
  name: "SubPage_PDFs",
  emits: ["toExam"],
  setup() {
    const PDFs = reactive({
      total_page: 5,
      current_page: 1,
      PDFlist: [
        { createtime: "2024-1-1", title: "name1", id: 1 },
        { createtime: "2024-1-2", title: "name2", id: 2 },
        { createtime: "2024-1-3", title: "name3", id: 3 },
        { createtime: "2024-1-4", title: "name4", id: 4 },
        { createtime: "2024-1-4", title: "name4", id: 5 },
        { createtime: "2024-1-4", title: "name4", id: 6 },
        { createtime: "2024-1-4", title: "name4", id: 7 },
      ],
    });
    const curPDF = reactive({
      PDFtitle: "title",
      examlist: [
        {
          createtime: "2024-1-1",
          done: true,
          state: "10/10",
          examid: 1,
        },
        {
          createtime: "2024-1-2",
          done: true,
          state: "10/10",
          examid: 2,
        },
        {
          createtime: "2024-1-3",
          done: true,
          state: "10/10",
          examid: 3,
        },
        {
          createtime: "2024-1-4",
          done: false,
          state: "5/10",
          examid: 4,
        },
        {
          createtime: "2024-1-5",
          done: false,
          state: "0/10",
          examid: 5,
        },
        {
          createtime: "2024-1-5",
          done: false,
          state: "0/10",
          examid: 5,
        },
        {
          createtime: "2024-1-5",
          done: false,
          state: "0/10",
          examid: 5,
        },
        {
          createtime: "2024-1-5",
          done: false,
          state: "0/10",
          examid: 5,
        },
        {
          createtime: "2024-1-5",
          done: false,
          state: "0/10",
          examid: 5,
        },
      ],
    });

    const click_upload = () => {
      console.log("uploading", linker.value);
      const res = false;
      if (res) {
        visible_uploadPDF.value = false;
        fetchpage();
      } else {
        ElMessage({
          message: "上传失败",
          type: "warning",
        });
      }
    };
    const fetchpage = async () => {
      console.log("fetching pages");
    };
    const pagechanged = (val) => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 5000);
      fetchpage();
      PDFs.current_page = val;
      console.log(`: ${PDFs.current_page}`);
    };
    const fetchexams = async () => {
      console.log("fetching exams");
    };
    const openexamlist = (val) => {
      fetchexams();
      loading_exams.value = true;
      setTimeout(() => {
        loading_exams.value = false;
      }, 1000);
      visible_currentPDF.value = true;
      console.log(val);
    };
    const gennewExam = () => {
      loading_exams.value = true;
      setTimeout(() => {
        loading_exams.value = false;
      }, 1000);
      fetchexams();
      ElMessage.success("成功生成");
    };
    const colorexam = (val) => {
      if(val.row.done)
        return {
          backgroundColor: "#EEFFBB",
          color: "#000",
        };

    };
    const toExam = (val) => {
      const questions = [
        {
          question_id: 10,
          question_type: 1,
          question_content: "CONTENT1",
          done: true,
          user_answer: "USER_ANSWER1",
          score: 70,
          passed: false,
          created_time: 10000000,
          answer_time: 20000000,
          standard_answer: "STANDARD_ANSWER1",
          review: "REVIEW1",
        },
        {
          question_id: 20,
          question_type: 2,
          question_content: "CONTENT2",
          done: false,
        },
        {
          question_id: 30,
          question_type: 3,
          question_content: "CONTENT3",
          done: false,
        },
      ];
      const savejson = JSON.stringify(questions);
      localStorage.setItem("Qlist", savejson);

      let examid = val.examid;
      console.log(examid);
      emit("toExam", examid);
    };

    const visible_uploadPDF = ref(false);
    const visible_currentPDF = ref(false);
    const recommend_drawer = ref(false);
    const is_uploading = ref(false);
    const loading = ref(false);
    const loading_exams = ref(false);
    const linker = ref("");
    const { proxy } = getCurrentInstance();
    const emit = proxy.$emit;

    return {
      ...toRefs(PDFs),
      ...toRefs(curPDF),
      visible_currentPDF,
      recommend_drawer,
      pagechanged,
      loading,
      visible_uploadPDF,
      linker,
      is_uploading,
      click_upload,
      fetchpage,
      loading_exams,
      openexamlist,
      gennewExam,
      toExam,
      colorexam,
    };
  },
};
</script>

<style>
</style>