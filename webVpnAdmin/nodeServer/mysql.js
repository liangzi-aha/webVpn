const mysql = require('mysql');

// 创建mysql 连接池
// mysql 连接池个人理解：接口每次查询数据库都要去系统底层调用资源（这很费时），而且每次使用过后都把资源释放了，连接池的作用是在初始化时就申请了很多资源，放到了一个盒子里（理解为盒子），有用户来调用接口查询数据库时，就从盒子里拿走一个资源去用，用完时在放回到盒子里，循环利用，不用再去申请资源了（申请资源要给操作系统打交道比较耗时）
const pool = mysql.createPool({
    host: "localhost", //这是数据库的地址
    user: "root", //需要用户的名字
    password: "123456", //用户密码
    database: "web_vpn", //数据库名字
    port: '3306'
}) //好了，这样我们就能连接数据库了


// 导出连接池对象
module.exports = pool;
