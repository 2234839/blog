/**
 * web服务器的配置文件
 */
const fs = require('fs');
const fun = require('../../nodeServer/function')

var serverConfig = {
    port: "80",
    web_root: "./webServer/web",//根据主要运行的js文件 index.js 来确定从哪里开始的,而不是webserver服务的server.js 的文件位置
    welcome_page: "/welcome.html",
    index_page: "/index.html",
    error_page: {
        "404": "/404.html"
    },
    routeTable: {//初始化的路由表
        '/': (req, res, cookie, sendFiles) => {//对直接访问地址的处理
            var path = ""
            if (cookie.init) {
                path = this.config.index_page;
            } else {
                path = this.config.welcome_page;
                //此处cookie的设置详见   https://blog.csdn.net/helloliuhai/article/details/18351439 https://www.cnblogs.com/ajianbeyourself/p/4900140.html
                //设置cookie有效期到世界末日,不允许js读取cookie
                res.setHeader('Set-Cookie', "init=true; expires= Fri, 31 Dec 9999 23:59:59 GMT;");
            }
            sendFiles(path, res)
        },
        '/post': (request, response, cookie, sendFiles, postdata) => {
            console.log("接收到一个post请求", postdata.toString())
            sendFiles(this.config.index_page, response);
        },
        '/file': (request, response, cookie, sendFiles, entireData) => {
            var file=fun.formFile(entireData)
            console.log(file,fun.cookieParse(file.describe))
            sendFiles(this.config.index_page, response);
            //保存文件
            // fs.writeFile("a.png", file.data, 'binary', function (err) {
            //     console.log(err)
            // });
        }
    }
};

module.exports.config = serverConfig;