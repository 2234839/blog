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
    }
};

module.exports.config = serverConfig;