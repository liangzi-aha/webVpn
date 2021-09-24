// 封装生成token，解析token方法
var jwt = require('jsonwebtoken');
// 配置jsonwebtoken生成token所需的secret，secret为加密密钥，不能泄露给其他人使用。
var secret = '李勇良';

module.exports = {
    create:function(obj){
        if(obj){
            // 返回加密的token
            // 设置加密内容 加上 secret（秘密）生产token
            return jwt.sign(obj,secret,{ expiresIn:'24h' })
        }
    },
    verify:function(token){
        if(token){
            // 返回加密的token
            return jwt.verify(token,secret,function(err,decoded){
                if(err){
                    return {'success':false};
                }else{
                    return {
                        'success':true,
                        'decoded':decoded
                    }
                }
            })
        }
    }
}