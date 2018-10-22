/**
 * web服务器的配置文件
 */

const userserver = require('../../nodeServer/userserver').function
var serverConfig = {
    port: "80",
    web_root: "./webServer/web",//根据主要运行的js文件 index.js 来确定从哪里开始的,而不是webserver服务的server.js 的文件位置
    welcome_page: "/welcome.html",
    index_page: "/index.html",
    error_page: {
        "404": "/404.html"
    },
    routeTable: {//初始化的路由表
        '/post': (request, response, cookie, sendFiles, postdata) => {
            console.log("接收到一个post请求", postdata.toString())
            sendFiles(this.config.index_page, response);
        },
        '/':userserver['/index'],//跳转首页
        '/file': userserver['/file'],//上传文件
        "/register": userserver["/register"],       //注册
        "/login": userserver["/login"],          //登录
        "/article": userserver["/article"],        //发布文章
        "/getArticle": userserver["/getArticle"],     //获取文章
        "/deleteArticle": userserver["/deleteArticle"],  //删除文章
        '/updateArticle': userserver["/updateArticle"],  //修改文章
        '/searchArticle': userserver['/searchArticle'],  //搜索文章
        '/getComment': userserver['/getComment'],     //获取文章评论
        '/addComment': userserver['/addComment'],     //提交评论
        '/deleteComment': userserver['/deleteComment'],  //删除评论
        '/cancellation':userserver['/cancellation'],//注销账号
        '/getUser':userserver['/getUser'],//获取用户信息
        '/getLoginUser':userserver['/getLoginUser'],//获取当前登录用户信息
        '/qr': function(request, response, cookie, sendFiles, data) {//get方法，返回一个qr码
            var tfa = require('2fa');
            tfa.generateKey(31, function (err, key) {
                console.log(key);
                tfa.generateGoogleQR('Company', 'email@gmail.com', key, function (err, qr) {
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                        var html= `<!DOCTYPE html>
                        <html lang="zh">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <meta http-equiv="X-UA-Compatible" content="ie=edge">
                            <title>Document</title>
                        </head>
                        <body>
                            <img src="${qr}">
                        </body>
                        </html>`
                    response.end(html);
                });
                var counter = Math.floor(Date.now()/100/3);
                var code = tfa.generateCode(key, counter);//用来登录的6位短码
                console.log(code);
            });
        }
    }
};
exports.config = serverConfig;