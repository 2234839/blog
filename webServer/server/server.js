var serverConfig = require("../config/serverConfig.js");
var http = require("http");
var url = require("url");
var fs = require("fs");
var querystring = require('querystring');
const fun = require('../../nodeServer/function')
var contentType = require("./ContentType")
var userTable=require('../../nodeServer/userserver').userTable//调试用

var sRoot = serverConfig.config.web_root;
//路由表
var routeTable = serverConfig.config.routeTable
// Create a server and start
var server = http.createServer(function (request, response) {
    var cookie =fun.stringParse(request.headers.cookie)
    /*cookie 目前的格式
    init:true
    loginCookie:""
    */
    //转换url编码
    var path = decodeURI(request.url);
    //打印用户的请求路径与用户
    console.log('用户:\x1b[34m',userTable.hasOwnProperty(cookie.loginCookie)?userTable[cookie.loginCookie].name:'__\x1b[33m游客__','\t\x1b[0m请求路径:\x1b[36m',path)
    //收集客户端发来的数据
    var postdata = [];
    if (request.method === "POST") {
        request.on('data', (chunk) => {
            postdata.push(chunk);
        });
        request.on('end', () => {
            postdata = Buffer.concat(postdata)
            if (routeTable.hasOwnProperty(path) && typeof routeTable[path] == "function") {
                routeTable[path](request, response, cookie, sendFiles, postdata);
            } else {
                sendFiles("", response);//空路径触发报错到404界面
            }
        });
    } else {//这里基本上就是get请求
        if (routeTable.hasOwnProperty(path)) {
            switch (typeof routeTable[path]) {
                case "string":
                    path = routeTable[path];
                case "function"://这里一般是各种服务的路径
                    //客户端发来的get 请求的数据
                    var data = url.parse(request.url, true).query
                    try { //这里的报错现在是由于有些服务只支持post但这里却调用了它导致的错误
                        routeTable[path](request, response, cookie, sendFiles, data);
                    } catch (error) {
                        console.error(error)
                        sendFiles(path, response);
                    }
                    break;
            }
        } else {
            sendFiles(path, response);
        }
    }
});

server.listen(serverConfig.config.port);
exports.server = server

//存储热门文件
var memoryFile = {}
/**
 * 向客户端发送一个文件，注意此方法内部指定了文件头
 * @param {string} path 文件路径,也可以为Erroe的错误，此方法将会将错误消息发送出去
 * @param {res} res 
 */
function sendFiles(sPath, response) {
    if (sPath instanceof Object) {
        if (sPath instanceof Error)
            sPath = {
                type: 'Error',
                message: sPath.message
            }
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(JSON.stringify(sPath));
        return
    }
    /**
     * 查询内存中是否已经存储了该文件，存在则直接发送该文件，否则读取文件再发送
     * 使用了这种方法之后减少了对磁盘的io，提高了反应速度
     */
    if (memoryFile.hasOwnProperty(sPath)) {
        response.end(memoryFile[sPath]);
    } else {
        fs.readFile(sRoot + sPath, function (err, data) {
            if (err) {// Redirect to 404 page
                fs.readFile(sRoot + serverConfig.config.error_page['404'], "utf-8", function (err, data) {
                    //response.writeHead(301, { 'Location': '' });
                    response.end(data);
                });
                return;
            }
            //设置文件头以便浏览器识别文件类型
            response.writeHead(200, {
                'Content-Type': contentType.query(sPath.substring(sPath.lastIndexOf('.'))),
                'Server': 'nodejs-v10.8.0_Blog_webserver',
                'Location': encodeURI(sPath),//这里必须转码，否则路径为中文时_http_server会报错
                'charset': 'utf-8'
            });
            //将文件存入内存  ！！！此处应该加上一个判断该文件是否热门的机制
            //TODO:目前处于调试阶段故关闭此功能 
            //memoryFile[sPath] = data;
            response.end(data);
        })
    }
};
