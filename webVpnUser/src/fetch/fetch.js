import { get,post } from './http';

// 接口统一管理
export default {
    // 用户登录接口
    login(params){
        return post('/flwebvpn_user/user_login',params)
    },
    // 用户获取资源 
    user_get_resource(params){
        return post('/flwebvpn_user/user_get_resource',params)
    },
    // 用户退出登录
    userLogout(params){
        return post('/flwebvpn_user/user_logout',params)
    },
    // get请求
    test(){
        console.log(get)
    }
}