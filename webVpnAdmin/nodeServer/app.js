const express = require('express');
const app = express();
const token = require('./token');
const path = require('path');
const pool = require('./mysql');
const url = require('url');
// bodyPaser 用于解析post请求体(bodyParse 已被弃用 直接使用 express 调用 bodyParse 的方法就行)
// var bodyParser = require('body-parser');
// 操作客户端cookie
// const cookieParser = require('cookie-parser');
// 删除cookie 放到响应里面 response header（set-cookie）
// res.clearCookie('name');
// 设置cookie 放到响应里面 response header（set-cookie）
// res.cookie('name','张三');
//设置操作cookie 中间件
// app.use(cookieParser());
// 
var history = require('connect-history-api-fallback');


// 权限管理接口token没有 admin 字段，拒绝访问admin接口
const InterfacePermissions = [
    '/flwebvpn/show_all_resource',
    '/flwebvpn/mod_resource',
    '/flwebvpn/add_resource',
    '/flwebvpn/del_resource',
    '/flwebvpn/show_all_role', 
    '/flwebvpn/add_role',
    '/flwebvpn/mod_role',
    '/flwebvpn/del_role',
    '/flwebvpn/set_role_bind_res',
    '/flwebvpn/show_all_user', 
    '/flwebvpn/add_user',
    '/flwebvpn/mod_user',
    '/flwebvpn/del_user',
    '/flwebvpn/set_user_bind_role',
    '/flwebvpn/role_bind_user',
]

//登录拦截器 一定要放到所有请求前面
app.all('/*', function(req, res, next){

    if(req.url == '/flwebvpn/user_login' || req.url == '/flwebvpn/login'){
        // next() 继续检索其他路由 接口
        next();
    } else if(req.headers.token){
        // token校验
        if(token.verify(req.headers.token).success){
            const verifyToken = token.verify(req.headers.token).decoded;
            // 进行数据库JsonWebToken 和 本地JsonWebToken 对比
            if(verifyToken.data.admin){   // 管理员token解析出来的数据带有admin字段
                checkJsonWebToken(req.headers.token,res,next,'tb_admin','name');
            } else{
                // 访问接口权限校验
                var fetchPermissions;
                InterfacePermissions.forEach(ele=>{
                    if(ele == req.url && !verifyToken.data.admin){
                        fetchPermissions = false;
                    }
                })
                // 访问了没有权限的接口
                if(fetchPermissions == false){
                    res.json({
                        success: false,
                        message: '您没有权限访问该接口'
                    });
                }else{
                    checkJsonWebToken(req.headers.token,res,next,'tb_user','user_id');  // 普通用户token解析出来的数据没有admin字段
                }
            }
        } else{
            res.json({
                jsonWebToken: false,
                message: 'token过时'
            });
        }
    } else{
        next();
    }
})



/**
 * 
 * @param {*} jsonWebToken  校验token
 * @param {*} res 响应对象
 * @param {*} next 继续检索其他路由 接口
 * @param {*} tableName 查询表字段名称
 * @param {*} accountId 查询账号字段名称
 */
// 查询数据库验证 jsonWebToken
function checkJsonWebToken(jsonWebToken,res,next,tableName,accountId){
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");
            var sql = `select * from ${ tableName } where ${ accountId } = '${ token.verify(jsonWebToken).decoded.data[accountId] }' and token= '${jsonWebToken}'`;
            // 查询当前用户携带的jsonWebToken和数据库是否一致
            connection.query(sql, function (err, result) {
                if (err || !result || result.length == 0) {
                    res.json({
                        jsonWebToken: false,
                        message: 'token不一致'
                    });
                } else {
                    next()
                }
                //回收pool
                connection.release();
            })
        }
    })
}

// 引入路由
const loginRegister = require('./router/loginRegister');
const userManagement = require('./router/userManagement');
const roleManagement = require('./router/roleManagement');
const resManagement = require('./router/resManagement');

// 处理vuehistory模式问题
app.use(history());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({extended:true}));
//parse application/jsjon
app.use(express.json());
// 公开静态资源
app.use('/', express.static('./publicStatic'));


//express-art-template 可以响应页面进行渲染
// app.engine('html', require('express-art-template'));

//把路由挂在到 app服务中
app.use(loginRegister);
app.use(userManagement);
app.use(roleManagement);
app.use(resManagement);

app.listen(5000,()=>{
    console.log('node服务启动成功');
})



