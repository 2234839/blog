/**
 * Created by ccn1069 on 2015/5/4.
 */

var serverConfig = require("../config/serverConfig.js");
var http = require("http");
var url = require("url");
var fs = require("fs");

var contentType=require("./ContentType")

// Create a server and start
var server = http.createServer(function (request, response) {
    var oUrl = url.parse(request.url);
    var sPath = oUrl.pathname;
    var sRoot = serverConfig.config.web_root;
    
    console.log(request.url,oUrl.pathname,sRoot + sPath)
    // If request the home directory, redirect to welcome page
    if (sPath === "/" || /^\/*\/$/.test(sPath)) {
        sPath = serverConfig.config.welcome_page;
    }
    response.writeHead(200, { 'Content-Type': contentType.query(sPath.substring(sPath.lastIndexOf('.'))) });
    // Read server resource content and output to browser
    //这里去掉它原来的 , "utf-8" encoding 参数  ,因为使用了这个参数则无法发送图片
    fs.readFile(sRoot + sPath, function (err, data) {
        if(err) {
            console.log(err);
            // Redirect to 404 page
            fs.readFile(sRoot + serverConfig.config.error_page['404'], "utf-8", function(err,data){
                response.writeHead(301,{'Location':''}); 
                response.end(data);
            });
            return;
        }
        response.end(data);
    })
});

server.listen(serverConfig.config.port);
exports.server=server