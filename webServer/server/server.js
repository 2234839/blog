var serverConfig = require("../config/serverConfig.js");
var http = require("http");
var url = require("url");
var fs = require("fs");
var contentType = require("./ContentType")

// Create a server and start
var server = http.createServer(function (request, response) {
    var oUrl = url.parse(request.url);
    var sPath = oUrl.pathname;
    var sRoot = serverConfig.config.web_root;

    var cookie = cookieParse(request.headers.cookie)

    //请求文件
    //console.log(request.url,oUrl.pathname,sRoot + sPath)
    // If request the home directory, redirect to welcome page
    if (sPath === "/" || /^\/*\/$/.test(sPath)) {
        if (cookie.init) {
            sPath = serverConfig.config.index_page;
        } else {
            sPath = serverConfig.config.welcome_page;
            //此处cookie的设置详见   https://blog.csdn.net/helloliuhai/article/details/18351439 https://www.cnblogs.com/ajianbeyourself/p/4900140.html
            //设置cookie有效期到世界末日,不允许js读取cookie
            response.setHeader('Set-Cookie', "init=true; expires= Fri, 31 Dec 9999 23:59:59 GMT;");
        }
    }
    // Read server resource content and output to browser
    fs.readFile(sRoot + sPath, function (err, data) {
        if (err) {
            console.log(err);
            // Redirect to 404 page
            fs.readFile(sRoot + serverConfig.config.error_page['404'], "utf-8", function (err, data) {
                response.writeHead(301, { 'Location': '' });
                response.end(data);
            });
            return;
        }
        //设置文件头以便浏览器识别文件类型
        response.writeHead(200, { 'Content-Type': contentType.query(sPath.substring(sPath.lastIndexOf('.'))) });
        response.end(data);
    })
});

server.listen(serverConfig.config.port);
exports.server = server
/**
 * 将cookie序列化为一个对象
 * 方法十分简单,对于复杂的cookie可能不适用
 * @param {string} cookies req.headers.cookie,从客户端获取到的cookie
 */
function cookieParse(cookies) {
    var obj = {}
    cookies.split(';').map(cookie => {
        var cookie = cookie.split('=')
        obj[cookie[0]] = cookie[1]
    })
    return obj
}