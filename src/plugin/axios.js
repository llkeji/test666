import axios from 'axios'
// 全局配置请求地址的根路径
// axios.defaults.baseURL = 'http://shiyansong.cn:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://123.57.143.201:8888/api/private/v1/'
// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://39.105.231.166:7001/api/private/v1/'
axios.defaults.baseURL = 'http://9yuecloud.com:9988/api/private/v1'
import { Loading } from 'element-ui';
let options = {
  lock: true,
  text: 'Loading',
  spinner: 'el-icon-loading',
  background: 'rgba(0, 0, 0, 0.7)'
}
// 全局配置请求头token
// axios.defaults.headers.common['Authorization'] = window.sessionStorage.getItem('token')
//添加请求拦截器
axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // console.log(config);
  Loading.service(options);
  return config
})

// 配置请求拦截或者响应拦截
axios.interceptors.response.use(res => {
  // 设置自己拿到数据之后的逻辑
  Loading.service(options).close()
  return res
})

export default axios