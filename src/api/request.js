import instance from "./header"

const debug = false

const request = class{
    constructor(url, args){
        this.url = url
        this.args = args
    }
    
    async myPOST(){
        return new Promise((resolve, reject) => {  
            if(debug){
                setTimeout()
            }
            else{
                instance.post((this.url), this.args)
                .then(res =>{
                    console.log(res)
                    if(!res.data.success){
                        console.log("rejected")
                        reject({success:false})
                    }
                    resolve(res.data)
                })
                .catch(err =>{
                    console.log(err)
                    reject({success:false})
                })
            }
        }).then(res => {
            return res
        }).catch(err => {
            return err
        })
    }

    async myGET(){
        return new Promise((resolve, reject) => {
            instance.get((this.url), {params: this.args})
            .then(res =>{
                console.log(res)
                if(!res.data.success) reject({success: res.success})
                const retquestions = []
                res.data.questions.forEach((element) => {
                    retquestions.push({question_id:element.question_id, 
                                      question_type:element.question_type,
                                      question_content:element.question_content})
                });
                resolve({success:true, questions:retquestions})
                // resolve(res)
            })
            .catch(err =>{
                // console.log(err)
                reject(err)
            })
        }).then(res => {
            return res
        }).catch(err => {
            return err
        })
    }
}

export default request