<template>
  <div>
    <el-table v-loading="loading" :data="PDFlist" style="width: 100%" height="300">
      <el-table-column prop="createtime" label="createTime" />
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
</template>

<script>
import { reactive, toRefs, ref} from "vue";
// import { ElMessage } from "element-plus";

export default {
  name: "SubPage_PDFs",
  setup() {
    const PDFs = reactive({
      total_page: 5,
      current_page: 1,
      PDFlist: [
        { createtime: "2024-1-1", title: "name1" },
        { createtime: "2024-1-2", title: "name2" },
        { createtime: "2024-1-3", title: "name3" },
        { createtime: "2024-1-4", title: "name4" },
        { createtime: "2024-1-4", title: "name4" },
        { createtime: "2024-1-4", title: "name4" },
        { createtime: "2024-1-4", title: "name4" },
      ],
    });
    const loading = ref(false)
    const pagechanged = (val) => {
        loading.value = true
        setTimeout(()=>{
            loading.value = false
        }, 5000)
      PDFs.current_page = val
      console.log(`: ${PDFs.current_page}`);
    };
    return { ...toRefs(PDFs), pagechanged, loading};
  },
};
</script>

<style>
</style>