import axios from 'axios';
import router from '../router';
import { ElMessage, ElLoading } from 'element-plus';
import { delCookie } from '../../public/static/utils/Cookie';

const apiBaseUrl = process.env.NODE_ENV === 'production' ? '' : '/api'

var loading;

//使用Element loading-start 方法
function startLoading() {
  loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

//使用Element loading-close 方法
function endLoading() {
  loading.close()
}

// axios 配置
axios.defaults.timeout = 60000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = '';

// 请求拦截  设置统一header
axios.interceptors.request.use(config => {
  console.log(config)
  // 加载
  startLoading()
  if (localStorage.token) {
    // 设置请求头
    config.headers.token = localStorage.token;
  }
  return config
}, error => {
  console.log(error)
  return Promise.reject(error)
})

// 响应拦截  401 token过期处理
axios.interceptors.response.use(response => {
  console.log(response)
  endLoading();

  // 响应判断 sesstion 是否过期
  if (response.data.code == '000018') {
    ElMessage({ message: response.data.message, type: 'error' });
    delCookie('flwebvpn_admin_sessionid');
    // 页面跳转
    router.push('/login');
  } else if (response.data.success == false) {
    if(response.data.code == '000012'){
      var bindRoleStr = '';  // eslint-disable-line no-unused-vars
      response.data.data.forEach((element,index) => {
        if((response.data.data.length -1) == index){
          bindRoleStr += element.role_name;
        } else{
          bindRoleStr += (element.role_name + "、")
        }
      });

      ElMessage({ message: ('当前资源被角色“' + bindRoleStr + '”绑定，' + '请解除绑定进行删除'), type: 'error' });
    } else{
      ElMessage({ message: response.data.message, type: 'error' });
    }
  }

  return response
}, error => {
  // 错误提醒
  endLoading();
  ElMessage({ message: error.response.data, type: 'error' })

  return Promise.reject(error)
})


export function post(url, params, headers) {
  return new Promise((resolve, reject) => {
    axios.post(apiBaseUrl + url, params, headers)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(apiBaseUrl + url + "?" + params)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default axios