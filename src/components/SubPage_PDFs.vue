<template>
  <div v-loading="tot_loading">
    <div style="text-align: left; font-size: 12px; padding: 10px">
      <el-button @click="visible_uploadPDF = true">添加文献</el-button>
      <el-button @click="click_recommend">推荐文献</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="PDFlist"
      style="width: 100%"
      height="500px"
      @row-click="openexamlist"
      :row-class-name="rowCreateTime"
      empty-text=" "
    >
      <el-table-column
        prop="created_time_translated"
        label="创建时间"
        width="200"
      />
      <el-table-column prop="title" label="论文题目" />
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
        :row-class-name="rowCreateTime"
        empty-text=" "
      >
        <el-table-column
          prop="created_time_translated"
          label="创建时间"
          width="200"
        />
        <el-table-column prop="state" label="测试完成情况" />
      </el-table>
    </el-scrollbar>
    <el-button @click="gennewExam" :disabled="loading_exams"
      >生成新测试</el-button
    >
  </el-dialog>

  <el-drawer v-model="recommend_drawer" title="推荐文献列表" direction="rtl">
    <div v-loading="loading_recommends">
      <el-scrollbar>
        <!-- <el-descriptions
          :column="1"
          border v-for="item in recommendations" :key="item.document_id" class="rec-item"
        >
          <el-descriptions-item label="标题" :labelStyle='labelStyle'>{{item.title }}</el-descriptions-item>
          <el-descriptions-item label="日期">{{item.date}}</el-descriptions-item>
          <el-descriptions-item label="作者">{{item.authors}}</el-descriptions-item>
          <el-descriptions-item label="摘要">{{item.abstract}}</el-descriptions-item>
      </el-descriptions> -->
        <el-card v-for="item in recommendations" :key="item.document_id" class="rec-item" @click="jumpTo(item.link)">
          <div>
            <!-- 标题、日期、作者、摘要，日期和作者斜体 -->
            <!-- 日期和作者的颜色为蓝色 -->
            <h3>Title: {{ item.title }}</h3>
            <p style="color: red;"><b>Date:</b> <i>{{ item.date }}</i></p>
            <p style="color: red;"><b>Authors:</b> <i>{{ item.authors }}</i></p>
            <!--摘要行距稍微大一点-->
            <p style="line-height: 1.5em;"><b>Abstract:</b> {{ item.abstract }}</p>
          </div>
        </el-card>
      </el-scrollbar>
    </div>
  </el-drawer>
</template>

<script>
import { reactive, toRefs, ref, getCurrentInstance, onMounted } from "vue";
import { ElMessage } from "element-plus";

export default {
  name: "SubPage_PDFs",
  emits: ["toExam"],
  setup() {
    const jumpTo = (val) => {
      console.log(val);
      window.open(val);

    };
    const PDFs = reactive({
      total_page: 1,
      current_page: 1,
      PDFlist: [],
    });
    const curPDF = reactive({
      PDFtitle: "title",
      PDFid: 0,
      examlist: [],
    });
    const RECs = reactive({
      recommendations: [],
    });

    onMounted(() => {
      fetchpage(0).then(() => {
        tot_loading.value = false;
      }).catch(()=>{
        tot_loading.value = false;
        ElMessage({
          message:"请求列表失败",
          type:"warning"
        })
      })
    });

    //Requests
    const fetchpage = async (idx) => {
      const url = proxy.$urls.names().get_documents;
      const ret = await new proxy.$request(url, { page_index: idx }).myGET(); //请求
      if (ret.success) {
        PDFs.PDFlist = ret.documents;
        PDFs.total_page = ret.total_pages;
      } else {
        await Promise.reject();
      }
    };
    const fetchexams = async (id) => {
      curPDF.examlist = [];
      const url = proxy.$urls.names().get_exams;
      const ret = await new proxy.$request(url, { document_id: id }).myGET(); //请求
      if (ret.success) {
        curPDF.examlist = ret.exams;
        curPDF.examlist.forEach((element, index) => {
          element["state"] =
            String(element.done_number) + "/" + String(element.question_number);
          return (curPDF.examlist[index] = element);
        });
      } else {
        await Promise.reject();
      }
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
    const fetchrecommendations = async () => {
      const url = proxy.$urls.names().get_recommends;
      const ret = await new proxy.$request(url).myGET(); //请求
      if (ret.success) {
        RECs.recommendations = ret.recommendations;
        for (let i = 0; i < RECs.recommendations.length; i++) {
          if (RECs.recommendations[i].link.indexOf("http") == -1) {
            RECs.recommendations[i].link = "https://" + RECs.recommendations[i].link;
          }
          // 日期
          let date = new Date(RECs.recommendations[i].date);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          RECs.recommendations[i].date = `${year}年${month}月${day}日`;

          RECs.recommendations[i].authors = RECs.recommendations[i].authors.join(", ");

        }
      } else {
        await Promise.reject();
      }
    };
    const genexam = async (id) => {
      const url = proxy.$urls.names().gen_exam;
      const ret = await new proxy.$request(url, { document_id: id }).myPOST(); //请求
      if (ret.success) {
        return ret.exam_id;
      } else {
        await Promise.reject();
      }
    };
    const uploadpdf = async () => {
      const url = proxy.$urls.names().upload_pdf;
      const ret = await new proxy.$request(url, {
        pdf_url: linker.value,
      }).myPOST(); //请求
      if (ret.success) {
        return { success: true };
      } else {
        await Promise.reject();
      }
    };

    //Interactions
    const click_upload = () => {
      // console.log("uploading", linker.value);
      is_uploading.value = true;
      uploadpdf()
        .then(() => {
          is_uploading.value = false;
          visible_uploadPDF.value = false;
          ElMessage({
            message: "上传成功",
            type: "success",
          });
          linker.value = "";
          pagechanged(1);
        })
        .catch(() => {
          is_uploading.value = false;
          ElMessage({
            message: "上传失败",
            type: "warning",
          });
        });
    }; //REFs
    const click_recommend = () => {
      loading_recommends.value = true;
      recommend_drawer.value = true;
      fetchrecommendations()
        .then(() => {
          loading_recommends.value = false;
        })
        .catch(() => {
          recommend_drawer.value = false;
          loading_recommends.value = false;
          ElMessage({
            message: "获取推荐列表失败",
            type: "warning",
          });
        });
    };
    const pagechanged = (val) => {
      PDFs.current_page = val;
      loading.value = true;
      fetchpage(PDFs.current_page - 1).then(() => {
        loading.value = false;
      }).catch(()=>{
        ElMessage({
          message:"请求列表失败",
          type:"warning",
        })
        loading.value = false;
      })
    };
    const openexamlist = (val) => {
      loading_exams.value = true;
      visible_currentPDF.value = true;
      curPDF.PDFtitle = val.title;
      curPDF.PDFid = val.document_id;
      fetchexams(val.document_id).then(() => {
        loading_exams.value = false;
      }).catch(()=>{
        loading_exams.value = false;
        ElMessage({
          message:"请求测试列表失败",
          type:"warning"
        })
      })
    };
    const gennewExam = () => {
      loading_exams.value = true;
      genexam(curPDF.PDFid).then((id) => {
          loading_exams.value = false;
          ElMessage({
            message: "生成成功",
            type: "success",
          });
          toExam({ exam_id: id });
        }).catch(() => {
          loading_exams.value = false;
          ElMessage({
            message: "生成失败",
            type: "warning",
          });
        });
    };
    const toExam = (val) => {
      loading_exams.value = true;
      fetchquestions(val.exam_id)
        .then(() => {
          let examid = val.exam_id;
          loading_exams.value = false;
          ElMessage({
            message: "开始测试",
            type: "success",
          })
          emit("toExam", examid);
        })
        .catch(() => {
          loading_exams.value = false;
          visible_currentPDF.value = false;
          ElMessage({
            message: "跳转测试失败",
            type: "warning",
          });
        });
    };

    const colorexam = (val) => {
      if (val.row.done)
        return {
          backgroundColor: "#EEFFBB",
          color: "#000",
        };
    };
    const rowCreateTime = ({ row }) => {
      let date = new Date(row.created_time);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      // const hours = String(date.getHours()).padStart(2, "0");
      // const minutes = String(date.getMinutes()).padStart(2, "0");
      row.created_time_translated = `${year}年${month}月${day}日`;
    };

    const visible_uploadPDF = ref(false);
    const visible_currentPDF = ref(false);
    const recommend_drawer = ref(false);
    const is_uploading = ref(false);
    const loading = ref(false);
    const tot_loading = ref(true);
    const loading_exams = ref(false);
    const loading_recommends = ref(false);
    const linker = ref("");

    const { proxy } = getCurrentInstance();
    const emit = proxy.$emit;

    return {
      ...toRefs(PDFs),
      ...toRefs(curPDF),
      ...toRefs(RECs),
      visible_currentPDF,
      recommend_drawer,
      pagechanged,
      loading,
      visible_uploadPDF,
      linker,
      is_uploading,
      click_upload,
      fetchpage,
      tot_loading,
      loading_exams,
      openexamlist,
      gennewExam,
      toExam,
      colorexam,
      loading_recommends,
      click_recommend,
      rowCreateTime,
      jumpTo,
    };
  },
};
</script>

<style>

.rec-item {
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
  text-align: left;
  margin: 20px;
  background-color: #f5f7fa;
  border-radius: 5px;
  cursor: pointer;

  

}

.rec-item:hover {
  background-color: #e6f7ff;
}
</style>

