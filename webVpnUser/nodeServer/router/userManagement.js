// const fs = require('fs');
const express = require('express');
// 创建router
const Router = express.Router();
// 引入mysql查询
const pool = require('../mysql');
// token
const Token = require('../token');

// 查询用户
Router.post('/flwebvpn/show_all_user', function (req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");

            var sql = "select user_id,user_name,user_number,user_role_id from tb_user";

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

// 注册
function register(user_name, user_number, user_pwd_md5, connection, res) {
    // 当前账户没有被注册，进行密码加密 注册
    var sql = `insert into tb_user (user_name,user_number,user_pwd_md5) values('${user_name}','${user_number}','${user_pwd_md5}')`;
    console.log(sql)
    // 查询账户是否存在
    connection.query(sql, function (err, result) {
        if (err) {
            res.json({
                success: false,
                message: '添加失败'
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

// 添加用户
Router.post('/flwebvpn/add_user', function (req, res) {
    const user_name = req.body.user_name;
    const user_number = req.body.user_number;
    const user_pwd_md5 = req.body.user_pwd_md5;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");

            var sql = `select user_number from tb_user where user_number = ${user_number}`;
            // 查询账户是否存在
            connection.query(sql, function (err, result) {
                if (err) {
                    res.json({
                        success: false,
                        message: '查询错误'
                    });
                } else if (result.length == 1) {
                    res.json({
                        success: false,
                        message: '该账户已注册，请去登录'
                    });
                } else {
                    register(user_name, user_number, user_pwd_md5, connection, res);
                }
            })
        }
    })
})


// 编辑用户 修改 名称、账号、密码 都清除token 重新登录
Router.post('/flwebvpn/mod_user', function (req, res) {
    const user_name = req.body.user_name;
    const user_number = req.body.user_number;
    const user_pwd_md5 = req.body.user_pwd_md5;
    const user_id = req.body.user_id;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");

            var sql = `update tb_user set user_name = ?,user_number = ?,user_pwd_md5 = ?,token = ? where user_id = ?`;
            // 查询账户是否存在
            connection.query(sql, [user_name, user_number, user_pwd_md5, '', user_id], function (err, result) {
                if (err) {
                    res.json({
                        success: false,
                        message: '查询错误'
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


// 删除用户
Router.post('/flwebvpn/del_user', function (req, res) {
    const user_id = req.body.user_id;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");

            var sql = `delete from tb_user where user_id = ?`;
            // 查询账户是否存在
            connection.query(sql, [user_id], function (err, result) {
                if (err) {
                    res.json({
                        success: false,
                        message: '删除错误'
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
    })
})

// 用户绑定角色  
Router.post('/flwebvpn/set_user_bind_role', function (req, res) {
    const user_id = req.body.user_id;
    const user_role_id = req.body.user_role_id;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");

            var sql = `update tb_user set user_role_id = ? where user_id = ?`;
            // 查询账户是否存在
            connection.query(sql, [user_role_id, user_id], function (err, result) {
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

// 查询角色是否绑定了用户
Router.post('/flwebvpn/role_bind_user', function (req, res) {
    const role_id = req.body.role_id;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");

            var sql = `select user_role_id,user_number,user_name,user_id from tb_user where user_role_id = ${role_id}`;
            // 查询账户是否存在
            connection.query(sql, function (err, result) {
                if (err) {
                    res.json({
                        success: false,
                        message: '查询错误'
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

// 获取用户资源  
Router.post('/flwebvpn/user_get_resource', function (req, res) {
    const user_id = req.body.user_id;

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("建立连接失败");
        } else {
            console.log("建立连接成功");

            var sql = `select user_role_id,user_number,user_name,user_id from tb_user where user_id = ${user_id}`;
            // 查询账户是否存在
            connection.query(sql, function (err, result) {
                if (err) {
                    res.json({
                        success: false,
                        message: '查询错误'
                    });
                } else {
                    searchRole(result[0].user_role_id,connection,res);
                }
            })
        }
    })
})

// 查询角色
function searchRole(role_id,connection,res) {
    
    var sql = `select * from tb_role where role_id = '${role_id}'`;
    // 查询角色信息
    connection.query(sql, function (err, result) {
        if (err) {
            res.json({
                success: false,
                message: '查询错误'
            });
        } else {
            searchRes(result[0].role_res_id_list,connection,res)
        }
    })
}

// 查询资源
function searchRes(role_res_id_list,connection,res){
    var sqlQueryCondition = '';
    var roleResIdList = role_res_id_list.split(',');

    // 循环拼接sql
    for(var i = 0;i < roleResIdList.length;i++){
        if(i == (roleResIdList.length - 1)){
            sqlQueryCondition += 'res_id = ' + roleResIdList[i];
        } else{
            sqlQueryCondition += 'res_id = ' + roleResIdList[i] + ' or '
        }
    }

    var sql = `select * from tb_resource where ${ sqlQueryCondition }`;

    // 资源列表
    connection.query(sql, function (err, result) {
        if (err) {
            res.json({
                success: false,
                message: '查询错误'
            });
        } else {
            res.json({
                success: true,
                data: result
            });
        }

        connection.release();
    })
}


module.exports = Router;