var serverConfig = require("../config/serverConfig.js");
var http = require("http");
var url = require("url");
var fs = require("fs");
const fun=require('../../nodeServer/function')
var contentType = require("./ContentType")

var sRoot = serverConfig.config.web_root;
//路由表
var routeTable = serverConfig.config.routeTable
// Create a server and start
var server = http.createServer(function (request, response) {
    startTime = new Date().getTime();
    var cookie = fun.cookieParse(request.headers.cookie)
    console.log(cookie)
    //转换url编码
    var path = decodeURI(request.url);
    //收集客户端发来的数据
    var postdata=[];
    if(request.method==="POST"){
        request.on('data', (chunk) => {
           postdata.push(chunk);
        });
        request.on('end', ()=> {
            postdata=Buffer.concat(postdata)
            if (routeTable.hasOwnProperty(path) && typeof routeTable[path]=="function") {
                routeTable[path](request, response, cookie,sendFiles,postdata);
            }else{
            }
        });
    }else{//这里基本上就是get请求
        //简易的路由表实现
        if (routeTable.hasOwnProperty(path)) {
            switch (typeof routeTable[path]) {
                case "string":
                    path=routeTable[path];
                case "function"://这里一般是各种服务的路径
                    routeTable[path](request, response, cookie,sendFiles);
                    break;
            }
        }else{
            sendFiles(path,response);
        }
    }
});

server.listen(serverConfig.config.port);
exports.server = server

//存储热门文件
var memoryFile={}
/**
 * 向客户端发送一个文件，注意此方法内部指定了文件头
 * @param {string} path 文件路径
 * @param {res} res 
 */
function sendFiles(sPath, response) {
    /**
     * 查询内存中是否已经存储了该文件，存在则直接发送该文件，否则读取文件再发送
     * 使用了这种方法之后减少了对磁盘的io，提高了反应速度
     */
    //设置文件头以便浏览器识别文件类型
    response.writeHead(200, { 'Content-Type': contentType.query(sPath.substring(sPath.lastIndexOf('.'))) });
    if (memoryFile.hasOwnProperty(sPath)) {
        response.end(memoryFile[sPath]);
        console.log("本次请求用时" + (new Date().getTime() - startTime) + "ms", sPath,"==>内存");
    } else {
        // Read server resource content and output to browser
        fs.readFile(sRoot + sPath, function (err, data) {
            if (err) {
                // Redirect to 404 page
                fs.readFile(sRoot + serverConfig.config.error_page['404'], "utf-8", function (err, data) {
                    //response.writeHead(301, { 'Location': '' });
                    response.end(data);
                });
                return;
            }
            //将文件存入内存  ！！！此处应该加上一个判断该文件是否热门的机制
            memoryFile[sPath] = data;
            response.end(data);
            console.log("本次请求用时" + (new Date().getTime() - startTime) + "ms", sPath,"===>磁盘");
        })
    }
};
