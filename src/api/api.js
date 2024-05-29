const url = "http://127.0.0.1:10086"

const urls = class{
    static names(){
        const login            = `${url}/login`
        const logout           = `${url}/logout`
        const register         = `${url}/register`
        const get_profile      = `${url}/get_user_profile`
        const get_documents    = `${url}/get_documents`
        const get_exams        = `${url}/get_exams`
        const get_questions    = `${url}/get_exam`
        const get_recommends   = `${url}/get_recommendations`
        const gen_exam         = `${url}/generate_exam`
        const ans_question     = `${url}/answer_question`
        const upload_pdf       = `${url}/upload_document`
        return {
            login,
            logout,
            register,
            get_profile,
            get_documents,
            get_exams,
            get_questions,
            get_recommends,
            gen_exam,
            ans_question,
            upload_pdf,
        }
    }

    // static urlGET(params){
    //     var ret = "?document_id=" + params["document_id"] 
    //     // console.log(params)
    //     params.forEach((key, param) => {
    //         ret += "?" + toString(key) + "=" + toString(param)
    //     })
    //     return ret
    // }
}

export default urls