<template>
    <h1>论文LLM问答demo</h1>
    <div>
        <el-input v-model="linker" placeholder="上传论文下载链接"/>
    </div>
    <div>
        <el-button @click="on_click" :loading="is_uploading" :disabled="linker==''">上传</el-button>
    </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue'
import { ElMessage } from 'element-plus'
export default {
    name: 'UploadPDF',
    setup(){
        localStorage.setItem("Qlist", "")
        const {proxy} = getCurrentInstance()
        const linker = ref("")
        const is_uploading = ref(false)
        const on_click = async()=>{
            const uploadpdf = proxy.$urls.names().upload_pdffile
            const dnloadques = proxy.$urls.names().dnload_questions
            is_uploading.value = true
            const retpdf = await new proxy.$request(uploadpdf, {pdf_url:linker.value}).myPOST()
            console.log(retpdf)
            if(retpdf.success){
                const docid = retpdf.document_id
                ElMessage({message:"提交成功，等待题目生成", type:"success"})
                // const retques = await new proxy.$request(dnloadques + proxy.$urls.urlGET({document_id:docid})).myGET()
                const retques = await new proxy.$request(dnloadques, {document_id:docid}).myGET()
                is_uploading.value = false
                if (retques.success){
                    const savejson = JSON.stringify(retques.questions)
                    localStorage.setItem("Qlist", savejson)
                    proxy.$router.push({name:"Q_and_A"})
                }
                else{
                    ElMessage({message:"题目请求失败", type:"warning"})
                }
            }
            else{
                is_uploading.value = false
                ElMessage({message:"提交失败", type:"warning"})
            }
            
        }
        return {linker, is_uploading, on_click}
    },
}
</script>

<style>

</style>