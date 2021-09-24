// const fs = require('fs');
const express = require('express');
// 创建router
const Router = express.Router();
// 引入mysql查询
const pool = require('../mysql');
// token
const Token = require('../token');

// 获取所有角色信息
Router.post('/flwebvpn/show_all_role', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");

            var sql = "select * from tb_role";

            // 查询账户是否存在
            connection.query(sql, function (err, result) {

                if (err) {
                    res.json({
                        success: false,
                        message: '错误'
                    });
                } else  {
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

// 添加角色 
Router.post('/flwebvpn/add_role', function (req, res) {
    const role_name = req.body.role_name;
    
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");

            var sql = "insert into tb_role (role_name,role_res_id_list) values (?,?)";

            // 查询账户是否存在
            connection.query(sql,[role_name,''], function (err, result) {

                if (err) {
                    res.json({
                        success: false,
                        message: '添加失败'
                    });
                } else  {
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


// 修改角色 
Router.post('/flwebvpn/mod_role', function (req, res) {
    const role_name = req.body.role_name;
    const role_id = req.body.role_id;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");

            var sql = "update tb_role set role_name = ? where role_id = ?";

            // 查询账户是否存在
            connection.query(sql,[role_name,role_id], function (err, result) {

                if (err) {
                    res.json({
                        success: false,
                        message: '修改失败'
                    });
                } else  {
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


Router.post('/flwebvpn/del_role', function (req, res) {
    const role_id = req.body.role_id;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");

            var sql = "delete from tb_role where role_id = ?";

            // 查询账户是否存在
            connection.query(sql,[role_id], function (err, result) {

                if (err) {
                    res.json({
                        success: false,
                        message: '删除失败'
                    });
                } else  {
                    res.json({
                        success: true,
                        message: '删除成功'
                    });
                }
                //回收pool
                connection.release();
            })
        }
    })
})


// 用户绑定角色  
Router.post('/flwebvpn/set_role_bind_res', function (req, res) {
    const role_res_id_list = req.body.role_res_id_list;
    const role_id = req.body.role_id;
    
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");
            
            var sql = `update tb_role set role_res_id_list = ? where role_id = ?`;
            // 查询账户是否存在
            connection.query(sql,[role_res_id_list,role_id], function (err, result) {
                if (err) {
                    res.json({
                        success: false,
                        message: '绑定失败'
                    });
                } else {
                    res.json({
                        success: true,
                        message: '绑定成功'
                    });
                }
                //回收pool
                connection.release();
            })
        }
    })
})

module.exports = Router;