/**
 * Created by ccn1069 on 2015/5/4.
 */
var serverConfig = {
    port: "80",
    web_root: "./webServer/web",//根据主要运行的js文件 index.js 来确定从哪里开始的,而不是webserver服务的server.js 的文件位置
    welcome_page: "/welcome.html",
    index_page:"/index.html",
    error_page: {
        "404": "/404.html"
    },
    routeTable:{//初始化的路由表
        '/':(req,res,cookie,sendFiles)=>{//对直接访问地址的处理
            var path=""
            if (cookie.init) {
                path = this.config.index_page;
            } else {
                path = this.config.welcome_page;
                //此处cookie的设置详见   https://blog.csdn.net/helloliuhai/article/details/18351439 https://www.cnblogs.com/ajianbeyourself/p/4900140.html
                //设置cookie有效期到世界末日,不允许js读取cookie
                res.setHeader('Set-Cookie', "init=true; expires= Fri, 31 Dec 9999 23:59:59 GMT;");
            }
            sendFiles(path,res)
        }
    }
};

module.exports.config = serverConfig;