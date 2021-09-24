/**
 * 1、添加setupProxy文件，文件名必须叫这个
 * 2、按照http-proxy-middleware中间件
 * 3、配置代理:
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://www.fengnever.icu:58080',
            changeOrigin: true,
            pathRewrite: {
                "^/api": ""
            },
        })
    );
    app.use(
        '/apc',
        createProxyMiddleware({
            target: 'http://192.168.0.105:5000',
            changeOrigin: true,
            pathRewrite: {
                "^/apc": ""
            },
        })
    );
};