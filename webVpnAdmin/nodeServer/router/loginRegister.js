// const fs = require('fs');
const express = require('express');
// 创建router
const Router = express.Router();
// 引入mysql查询
const pool = require('../mysql');
// token
const Token = require('../token');


/**
 * 
 * @param {*} connection  连接池
 * @param {*} userAccount  用户账号
 * @param {*} token  令牌
 * @param {*} tableName  表名
 * @param {*} accountName  账号字段
 * @param {*} callback  回调函数
 */
// 登录成功保存 更改该账户的JSONWebToken
function updateJsonWebToken(connection,userAccount,token,tableName,accountName,callback) {
    var sql = `update ${tableName} set token='${token}' where ${accountName} = ${userAccount}`;
    connection.query(sql, function (err, result) {
        if(err || !result){
            console.log('JSONWebToken更新失败')
        } else if(result.changedRows == 1){
            console.log('JSONWebToken更新成功')
            callback();
        }
        //回收pool
        connection.release();
    })
}

// 用户登录接口
Router.post('/flwebvpn/user_login', function (req, res) {
    const userAccount = req.body.user_number;
    const userPassword = req.body.user_pwd_md5;

    // 从连接池中取资源（请求接口需要调用系统资源，每次调用比较耗时，而每次请求完毕之后都将资源释放掉了，使用连接池在初始化时申请了很多资源，每次用户请求就去连接池取资源，使用完毕之后归还到连接池，不释放资源）
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");
            var sql = `select user_name,user_number,user_id from tb_user where user_number = '${userAccount}' and user_pwd_md5 = '${userPassword}'`
            connection.query(sql, function (err, result) {
                if (err || !result || result.length == 0) {
                    res.json({
                        success: false,
                        message: '账号或密码错误'
                    });
                } else {
                    console.log('登录成功')
                    const localToken = Token.create({
                        data: result[0]
                    });

                    // 更新数据库 jsonWebtoken
                    updateJsonWebToken(
                        connection,
                        userAccount,
                        localToken,
                        'tb_user',
                        'user_number',
                        function(){
                            res.json({
                                success: true,
                                data: result[0],
                                token: localToken,
                                message: '登录成功'
                            })
                        }
                    )
                }
                //回收pool
                // connection.release();
            })
        }
    })
})

// 管理员登录接口
Router.post('/flwebvpn/login', function (req, res) {
    const userAccount = req.body.name;
    const userPassword = req.body.pwd_md5;

    // 从连接池中取资源（请求接口需要调用系统资源，每次调用比较耗时，而每次请求完毕之后都将资源释放掉了，使用连接池在初始化时申请了很多资源，每次用户请求就去连接池取资源，使用完毕之后归还到连接池，不释放资源）
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");
            var sql = `select name from tb_admin where name = '${userAccount}' and pwd_md5 = '${userPassword}'`
            connection.query(sql, function (err, result) {
                if (err || !result || result.length == 0) {
                    res.json({
                        success: false,
                        message: '账号或密码错误'
                    });
                } else {
                    console.log('登录成功')
                    // 管理员登录token 添加 admin: true 标识
                    const localToken = Token.create({
                        data: Object.assign(result[0],{ admin: true})
                    });

                    // 更新数据库 jsonWebtoken
                    updateJsonWebToken(
                        connection,
                        userAccount,
                        localToken,
                        'tb_admin',
                        'name',
                        function(){
                            res.json({
                                success: true,
                                data: result[0],
                                token: localToken,
                                message: '登录成功'
                            })
                        }
                    )
                }
                //回收pool
                // connection.release();
            })
        }
    })
})



module.exports = Router;