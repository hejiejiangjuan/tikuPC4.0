/** 
* http配置 
*/
//引入请求插件 
import axios from "axios"
import { Message } from 'element-ui'
// 超时时间 
axios.defaults.timeout = 20000
// http请求拦截器 
axios.interceptors.request.use(config => {
  //do something…..
  return config
}, error => {
  return Promise.reject(error)
})
// http响应拦截器 
axios.interceptors.response.use(data => {// 响应成功关闭loading 
  if(data.data.code == 205){
    this.$router.push({ path: "/login" });
    // window.location.href = window.location.origin
    Message.error({
      message: '登录失效，请重新登录！'
    })
    return ;
  }
  //在这里做验证是否登录的判断 
  // do something…..

  //拦截数据，如果不return是不会有返回数据的 
  return data;
}, error => {
  return Promise.reject(error)
})

export default axios