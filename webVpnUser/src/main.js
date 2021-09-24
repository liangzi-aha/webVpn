import { createApp } from 'vue';
import App from './App.vue';
// import { ElMessage } from 'element-plus';
import ElementPlus from 'element-plus';
// import 'element-plus/dist/index.css';  // element css 打包之后为什么没有包，导致没有样式，在html中引入全局
import router from './router';
import store from './store';
import "animate.css";
import fetch from './fetch/fetch';
import md5 from 'md5';
import token from './token';
import * as echarts from 'echarts';
import { setCookie,getCookie,delCookie } from '../public/static/utils/Cookie'
  
const app = createApp(App);

// md5加密秘钥
const secret = 'LYL';


// vue3 给原型上挂载属性
app.config.globalProperties.$fetch = fetch;
app.config.globalProperties.$echarts = echarts;
app.config.globalProperties.$token = token;
app.config.globalProperties.$setCookie = setCookie;
app.config.globalProperties.$getCookie = getCookie;
app.config.globalProperties.$delCookie = delCookie;

// 密码加密
app.config.globalProperties.$md5 = function(password){
    return md5(secret+ password +secret)
};

app.use(ElementPlus);
app.use(store).use(router).mount('#app');


// 路由守卫
router.beforeEach((to, from, next) => {
    if(to.meta.title){
        document.title=to.meta.title
    }

    const flwebvpn_user_sessionid = getCookie('flwebvpn_user_sessionid');
    
    // 路由校验token是否过期
    if(to.path == '/login'){
        next();
    } else if(flwebvpn_user_sessionid){
        next();
    }  else{
        // console.log('跳转登录页面');
        // ElMessage({type:"error",message:'sessionid过期请重新登录'});
        next('/login')
    }
})


export default app;
