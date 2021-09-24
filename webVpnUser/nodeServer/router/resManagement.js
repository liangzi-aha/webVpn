// const fs = require('fs');
const express = require('express');
// 创建router
const Router = express.Router();
// 引入mysql查询
const pool = require('../mysql');
// token
const Token = require('../token');

// 字符串拼接
function changeUrl(url) {
    // url字符串转 url
    const urlParams = new URL(url);
    // hostname 截取 拼接字符串
    var hostnameSplit = urlParams.hostname.split('.');
    var hostnameStr = '';
    hostnameSplit.forEach((ele,index) => {
        if(index == hostnameSplit.length -1){
            var str = new Array((6-(hostnameSplit.length -1))).fill('-').join('');
            hostnameStr += (str + ele);
        } else{
            hostnameStr += ('-' + ele);
        }
    })

    var chaUrl = 'https://fsfsfs' + urlParams.protocol.split(':')[0] + hostnameStr + '--p' + urlParams.port + '.fengnever.icu:10101' + urlParams.pathname;

    return chaUrl;
}

// 获取所有角色信息
Router.post('/flwebvpn/show_all_resource', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");

            var sql = "select * from tb_resource";

            // 查询账户是否存在
            connection.query(sql, function (err, result) {

                if (err) {
                    res.json({
                        success: false,
                        message: '错误'
                    });
                } else {
                    res.json({
                        success: true,
                        data: result
                    });
                }
                //回收pool
                connection.release();
            })
        }
    })
})


// 修改资源信息
Router.post('/flwebvpn/mod_resource', function (req, res) {
    const res_id = req.body.res_id;
    const res_name = req.body.res_name;
    const res_url = req.body.res_url;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");

            var sql = "update tb_resource set res_name = ?,res_url = ?,chg_res_url = ? where res_id = ?";
            // 查询账户是否存在
            connection.query(sql, [res_name, res_url, changeUrl(res_url), res_id], function (err, result) {

                if (err) {
                    res.json({
                        success: false,
                        message: '错误'
                    });
                } else {
                    res.json({
                        success: true,
                        message: '修改成功'
                    });
                }
                //回收pool
                connection.release();
            })
        }
    })
})


// 添加资源信息
Router.post('/flwebvpn/add_resource', function (req, res) {
    const res_name = req.body.res_name;
    const res_url = req.body.res_url;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");

            var sql = "insert into tb_resource (res_name,res_url,chg_res_url) values (?,?,?)";

            // 查询账户是否存在
            connection.query(sql, [res_name, res_url, changeUrl(res_url)], function (err, result) {

                if (err) {
                    res.json({
                        success: false,
                        message: '错误'
                    });
                } else {
                    res.json({
                        success: true,
                        message: '添加成功'
                    });
                }
                //回收pool
                connection.release();
            })
        }
    })
})

// 删除资源  
Router.post('/flwebvpn/del_resource', function (req, res) {
    const res_id = req.body.res_id;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");

            var sql = "select * from tb_role where role_res_id_list like '%?%'";

            // 查询账户是否存在
            connection.query(sql, [res_id], function (err, result) {

                if (err) {
                    res.json({
                        success: false,
                        message: '错误'
                    });
                } else {
                    // 接口length大于0，代表绑定了角色
                    if (result.length > 0) {
                        var roleStr = '';
                        for (let index = 0; index < result.length; index++) {
                            if (index == (result.length - 1)) {
                                roleStr += result[index].role_name;
                            } else {
                                roleStr += result[index].role_name + '、';
                            }
                        }

                        res.json({
                            success: false,
                            message: '该资源已绑定' + roleStr + '，请解除资源进行删除',
                        });
                        //回收pool
                        connection.release();
                    } else {
                        var sql1 = "delete from tb_resource where res_id = ?";
                        // 查询账户是否存在
                        connection.query(sql1, [res_id], function (err, result) {

                            if (err) {
                                res.json({
                                    success: false,
                                    message: '错误'
                                });
                            } else {
                                res.json({
                                    success: true,
                                    message: '删除成功'
                                });
                            }
                            //回收pool
                            connection.release();
                        })
                    }
                }

            })


        }
    })
})

module.exports = Router;