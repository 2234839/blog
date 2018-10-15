/**
 * web服务器的配置文件
 */
const fs = require('fs');
const fun = require('../../nodeServer/function')
const userserver=require('./../../nodeServer/userserver').function
var serverConfig = {
    port: "80",
    web_root: "./webServer/web",//根据主要运行的js文件 index.js 来确定从哪里开始的,而不是webserver服务的server.js 的文件位置
    welcome_page: "/welcome.html",
    index_page: "/index.html",
    error_page: {
        "404": "/404.html"
    },
    routeTable: {//初始化的路由表
        '/': (req, response, cookie, sendFiles) => {//对直接访问地址的处理
            var path = ""
            if (cookie.init) {
                path = this.config.index_page;
            } else {
                path = this.config.welcome_page;
                //此处cookie的设置详见   https://blog.csdn.net/helloliuhai/article/details/18351439 https://www.cnblogs.com/ajianbeyourself/p/4900140.html
                //设置cookie有效期到世界末日,不允许js读取cookie
                response.setHeader('Set-Cookie', "init=true; expires= Fri, 31 Dec 9999 23:59:59 GMT;");
            }
            //重定向
            response.writeHead(303, { 'Content-Type':'text/html',
                'Server':'nodejs-v10.8.0_gs-webserver',
                'Location': path
            })
            response.end()
        },
        '/post': (request, response, cookie, sendFiles, postdata) => {
            console.log("接收到一个post请求", postdata.toString())
            sendFiles(this.config.index_page, response);
        },
        '/file':async (request, response, cookie, sendFiles, entireData) => {
            let res={//wangEdit要求的数据回传格式
                // errno 即错误代码，0 表示没有错误。
                //       如果有错误，errno != 0，可通过下文中的监听函数 fail 拿到该错误码进行自定义处理
                errno: 0,
                // data 是一个数组，返回若干图片的线上地址
                data: []
            }
            function ranStr() {
                return Math.random().toString(36).substring(2)+Math.random().toString(36).substring(2)+Math.random().toString(36).substring(2)
            }
            //保存文件
            const files=fun.formFile(entireData)//解析二进制的数据
            for (let i = 0; i < files.length; i++) {
                const element = files[i];
                let path=await (new Promise((resolve,reject)=>{
                    const tempPatn=ranStr()+"_"+element.describe.filename
                        //TODO:这里的目录应该要再初始化模块中初始化
                        //TODO:理论上来说如果有人构造恶意数据这里的filename直接拼接是一个严重的漏洞 比如将name 构造为 ../之类的
                        fs.writeFile(process.cwd()+"/webServer/web/file/"+tempPatn, entireData.slice(element.start,element.end), 'binary', (err)=>{
                            if(err)
                            reject(err)
                            else{
                                //这个路径是基于web目录的TODO:应该按照config来配置
                                resolve("./file/"+tempPatn)
                            }
                        });
                    }))
                res.data.push(path)
            }
            sendFiles(res, response);
        },
        "/register"     :userserver["/register"],       //注册
        "/login"        :userserver["/login"],          //登录
        "/article"      :userserver["/article"],        //发布文章
        "/getArticle"   :userserver["/getArticle"],     //获取文章
        "/deleteArticle":userserver["/deleteArticle"],  //删除文章
        '/updateArticle':userserver["/updateArticle"],  //修改文章
        '/searchArticle':userserver['/searchArticle'],  //搜索文章
        '/getComment'   :userserver['/getComment'],     //获取文章评论
        '/addComment'   :userserver['/addComment'],     //提交评论
        '/deleteComment':userserver['/deleteComment'],  //删除评论
    }
};
exports.config = serverConfig;