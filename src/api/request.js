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
                    if(!res.data.success){
                        reject({success:false})
                    }
                    resolve(res.data)
                })
                .catch(()=>{
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
                resolve(res.data)
            })
            .catch(err =>{
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