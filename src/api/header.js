import axios from "axios"
import qs from "qs"
// import {Elmessagebox} from "element-plus"

axios.defaults.withCredentials = true;
let instance = axios.create({
    headers:{"Content-Type":"application/x-www-form-urlencoded"},
})

instance.interceptors.request.use(
    config => {
        config.data = qs.stringify(config.data)
        return config
    },
    error => Promise.error(error)
)

export default instance