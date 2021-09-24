import axios from 'axios';
import { Toast } from 'antd-mobile';
import { createBrowserHistory } from 'history';
import { delCookie } from '../utils/common.js'

const history = createBrowserHistory();

history.listen((e) => {  console.log(e, '开启了withRouter')  })

const apiBaseUrl = process.env.NODE_ENV === 'production' ? '' : '/api';

// axios 配置
axios.defaults.timeout = 60000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = '';
// 加载动画
var toast = '';

// POST传参序列化
axios.interceptors.request.use((config) => {
    // config.headers['Content-Type'] != "multipart/form-data" 上传文件不用使用stringify格式化参数
    // console.log(config)
    // 开启加载动画
    toast = Toast.loading('Loading...', 0, '', true);

    return config
}, (error) => {
    return Promise.reject(error)
})

// 返回状态判断
axios.interceptors.response.use((res) => {
    // 关闭加载动画
    Toast.hide(toast);
    if (res.data.success === false) {
        // 删除资源，提示信息
        if (res.data.code === '000012') {
            var bindRoleStr = '';  // eslint-disable-line no-unused-vars
            res.data.data.forEach((element, index) => {
                if ((res.data.data.length - 1) === index) {
                    bindRoleStr += element.role_name;
                } else {
                    bindRoleStr += (element.role_name + "、")
                }
            });

            Toast.fail(`当前资源被角色“${bindRoleStr}”绑定，请解除绑定进行删除`); 
        } else if(res.data.code === '000018') {
            // 回话结束
            Toast.fail(res.data.message);
            delCookie('flwebvpn_admin_sessionid');
            history.push('/login');
        } else{
            Toast.fail(res.data.message);
        }
    }
    return res;
}, (error) => {
    return Promise.reject(error)
})

export function HttpPost(url, params, headers) {
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

export function HttpGet(url, params) {
    return new Promise((resolve, reject) => {
        console.log(apiBaseUrl + url + "?" + params);
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