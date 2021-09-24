import axios from 'axios';
import router from '../router';
import { ElMessage,ElLoading } from 'element-plus';
// import token from '../token';

const apiBaseUrl = process.env.NODE_ENV === 'production' ? '' : '/api'

var loading;

function startLoading() {    //使用Element loading-start 方法
  loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
function endLoading() {    //使用Element loading-close 方法
  loading.close()
}

// axios 配置
axios.defaults.timeout = 60000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
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

  // 响应判断jsonWebToken是否过期
  if (response.data.jsonWebToken == false) {
    ElMessage({ message: 'token值无效，请重新登录', type: 'error' });
    // token 过期清理 token
    localStorage.removeItem("token");
    // 页面跳转
    router.push('/login');
  } else if(response.data.success == false){
    ElMessage({ message: response.data.message, type: 'error' });
  }

  return response
}, error => {
  // 错误提醒
  endLoading();
  ElMessage({ message: error.response.data, type: 'error' })

  const { status } = error.response
  if (status == 401) {
    ElMessage({ message: 'token值无效，请重新登录', type: 'error' })
    // 清除token
    localStorage.removeItem('token')

    // 页面跳转
    router.push('/login')
  }

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