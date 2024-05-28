const url = "http://127.0.0.1:10086"

const urls = class{
    static names(){
        const upload_pdffile   = `${url}/upload_document`
        const upload_answer    = `${url}/answer_question`
        const dnload_questions = `${url}/get_questions`
        const login            = `${url}/login`
        const logout           = `${url}/logout`
        const register         = `${url}/register`
        const get_profile      = `${url}/get_user_profile`
        return {
            upload_pdffile,
            upload_answer,
            dnload_questions,
            login,
            logout,
            register,
            get_profile
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