<template>
    <div>
        <!-- <div>{{question_title}}, {{question_dscrp}}</div> -->

        <div>
            题目{{Qindx + 1}}/{{len}} 
        </div>
        <div>
            类型：{{question_type==3?"论述题":question_type==2?"填空题":question_type==1?"判断题：请填写'正确'或'错误'":"选择题：请填写A，B，C或者D"}}
        </div>
        <div>
            题目内容: {{question_content}}
        </div>
        <div v-if="isAnswering">
            <el-input v-if="isBKF" placeholder="输入你的答案" type="textarea" v-model="answer">
            </el-input>
        </div>
        <div v-else>
            <div>是否通过：{{passed?"是":"否"}}</div>
            <div>分数：{{parseFloat(score).toFixed(2)}}</div>
            <div>你的作答：{{answer}}</div>
            <div>答案与解析：{{standard_answer}}</div>
            <div v-if="review!=''">评审意见：{{review}}</div>
        </div>
        <div>
            <el-button v-if="isAnswering" @click="submit_answer" :loading="is_loading">提交回答</el-button>
            <el-button @click="next_question" :disabled="forbidnext">{{isAnswering?"跳过本题":"下一题"}}</el-button>
            <el-button @click="go_reupload_file">退出重传文本</el-button>
        </div>
    </div>
</template>

<script>
import {reactive, toRefs, getCurrentInstance, onMounted, onBeforeUnmount} from "vue"
import {ElMessage} from "element-plus"


export default {
    name: 'QuestionWrapper',
    setup(){
        const {proxy} = getCurrentInstance()
        if(localStorage.getItem("Qlist") == ""){
            ElMessage({
                message: '没有提交链接',
                type: 'warning',
            })
            proxy.$router.push({name:"upload_pdf"})
            return
        }
        
        const Q_manager = reactive({
            Qindx:0,
            Qlist:JSON.parse(localStorage.getItem("Qlist"))
        })
        const user_answer = reactive({
            answer:"",
            question_id:0,
            question_type:0,
            question_content:"",
            len:Q_manager.Qlist.length,
        })
        const user_judgement = reactive({
            passed:true,
            score:5.0,
            standard_answer:"",
            review:""
        })
        const renderer = reactive({
            isAnswering:true,
            isBKF:true,
            is_loading:false,
            forbidnext:false,
        })
        
        const submit_answer = async() => {
            console.log("submit answer")
            const answerjson = {question_id:user_answer.question_id, user_answer:user_answer.answer}
            
            renderer.is_loading = true
            const url = proxy.$urls.names().upload_answer
            const ret = await new proxy.$request(url, answerjson).myPOST()
            renderer.is_loading = false
            if(ret.success){
                renderer.isAnswering = false
                user_judgement.standard_answer = ret.standard_answer
                user_judgement.review = user_answer.question_type == 3?ret.review:""
                user_judgement.score = ret.score
                user_judgement.passed = ret.passed
            }
            else{
                renderer.isAnswering = true
                ElMessage({
                    message: '提交失败',
                    type: 'warning',
                })
            }
        }
        const go_reupload_file = () => {
            console.log("return reupload file page")
            localStorage.setItem("Qlist", "")
            proxy.$router.push("/")
        }
        const next_question = () =>{
            Q_manager.Qindx += 1
            user_answer.question_id = Q_manager.Qlist[Q_manager.Qindx].question_id
            user_answer.question_type = Q_manager.Qlist[Q_manager.Qindx].question_type
            user_answer.question_content = Q_manager.Qlist[Q_manager.Qindx].question_content
            renderer.isAnswering = true
            user_answer.answer = ""
            user_judgement.score = -1
            if(Q_manager.Qindx >= Q_manager.Qlist.length - 1){
                renderer.forbidnext = true
            }
        }
        onMounted(()=>{
            user_answer.question_id = Q_manager.Qlist[Q_manager.Qindx].question_id
            user_answer.question_type = Q_manager.Qlist[Q_manager.Qindx].question_type
            user_answer.question_content = Q_manager.Qlist[Q_manager.Qindx].question_content
        })
        onBeforeUnmount(()=>{
            localStorage.setItem("Qlist", "")
        })
        return {...toRefs(user_answer), ...toRefs(renderer), ...toRefs(user_judgement), ...toRefs(Q_manager), submit_answer, go_reupload_file, next_question}
    },
}
</script>

<style>

</style>