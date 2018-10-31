/**
 * 对user.js 的功能的一些封装
 */
const fs = require('fs');
var fun=require('./function')
var user=require('./user')
const sqlObj=require('./sqlObj')
// var routeTable=require('./../webServer/config/serverConfig').config.routeTable
// routeTable["/register"]=register
// routeTable["/login"]=login
//最下方有一个服务监听路径的对象
var userTable={}
exports.userTable=userTable
/**
 * 注册功能
 * @param {object} postdata post提交的数据
 */
function register(request, response, cookie, sendFiles, postdata){
    var obj=fun.stringParse(postdata.toString())
    var use=new sqlObj.user(obj.id,obj.name,obj.password,obj.data,obj.msg)
    user.addUser(use).then((results)=>{
        sendFiles(results,response)
    })
    .catch((err)=>{
        sendFiles(err,response)
    })
}
/**
 * 登录功能
 * @param {object} user 用户对象模型
 */
function login(request, response, cookie, sendFiles, postdata){
    var obj=fun.stringParse(postdata.toString())
    var use=new sqlObj.user(obj.id,obj.name,obj.password,obj.data,obj.msg,cookie.loginCookie)
    user.login(use).then((results)=>{//TODO:这里是保持登录状态的cookie持续时间不该设置的这么长
        results.message+="\n嗨！ 欢迎"+results.name+"来到神行"
        response.setHeader('Set-Cookie', "loginCookie="+results.cookies+"; expires= Fri, 31 Dec 9999 23:59:59 GMT;");
        delete results.password
        sendFiles(results,response)
        userTable[results.cookies]=results//将此用户的cookie及个人信息记入内存
    })
    .catch((err)=>{
        sendFiles(err,response)
    })
}
/**
 * 判断用户是否已登录，此处仅判断了用户是否在服务器开启期间登录
 * @param {string} cookies cookies
 */
function isLogin(cookies){
    return userTable.hasOwnProperty(cookies)
}
/**
 * 提交文章
 */
async function upArticle(request, response, cookie, sendFiles, postdata) {
    if(!isLogin(cookie.loginCookie)){
        sendFiles(new Error("请登录后再尝试发送"),response)//请登录后在尝试发送
        return;
    }
    use=userTable[cookie.loginCookie]
    let article=new sqlObj.article(JSON.parse(postdata))
    article.name=use.name
    sendFiles(await user.article(article),response)
}
/**
 * 获取文章
 */
async function getArticle(request, response, cookie, sendFiles, postdata) {
    // var post=fun.stringParse(postdata.toString) TODO:stringParse函数报错 TypeError: str.replace is not a function  找不到原因
    var post=JSON.parse(postdata)
    var results=null
    try {
        results=await user.getArticle(post.start,post.end)
    } catch (error) {
        sendFiles(new Error("获取文章失败"),response)
        return
    }
    results.type="results"
    results.message="获取文章成功"
    sendFiles(results,response)
}
/**
 * 删除文章，提交的对象格式应为{article，user}
 */
async function deleteArticle(request, response, cookie, sendFiles, postdata) {
    var post=JSON.parse(postdata)
    if(isNaN(post.article.num)){
        var message="没有文章的编号或者该编号错误"
        sendFiles({message},response)
        return
    }
    var articleResults=await user.getArticleNum(post.article.num)
    if(articleResults.name==userTable[post.user.cookies].name){//TODO:应该写一个更完善的管理机制
        var message=await user.deleteArticle(post.article.num)
    }else{
        var message="您未拥有该文章的管理权"
    }
    sendFiles({message},response)
}
/**
 * 修改文章的功能函数，要求postdata是article格式的json，TODO:此处未进行验证，存在安全隐患,权限验证不够完善
 */
async function updateArticle(request, response, cookie, sendFiles, postdata){
    let article=new sqlObj.article(JSON.parse(postdata))
    let results=null
    try {
        results=await user.updateArticle(article)
    } catch (error) {
        if(error.errno==1406){//内容过长
            sendFiles(error,response)
            return
        }
        throw error
    }
    let message=""
    if(results.affectedRows==1)
        message="修改成功！"
    else{
        message="修改失败！"
        console.error("修改失败",results);
    }
    sendFiles({message},response)
}
/**
 * 搜索文章,post应含有start end serchStr 字段 返回一个结果集或者错误
 */
async function searchArticle(request, response, cookie, sendFiles, postdata){
    const post=JSON.parse(postdata)
    if(post.start<0 || post.end<0){
        sendFiles(new Error("用于分页的数值是错误的"),response)
        return
    }
    let num
    let results
    try {
        num= await user.searchArticle(post.serchStr,true)
        results= await user.searchArticle(post.serchStr,false,post.start,post.end)
    } catch (error) {
        sendFiles(error,response)
        return
    }
    sendFiles({num,results,message:"共查询到"+num+"条结果"},response)
}
/**
 * 获取评论
 * post 应含有字段articleNum 指向文章
 */
async function getComment(request, response, cookie, sendFiles, postdata) {
    let post
    try {
        post=JSON.parse(postdata)
    } catch (error) {
        sendFiles(new Error("提交的信息格式不对"),response)
        return
    }
    let results
    try {
        results=await user.getComment(post.articleNum)
    } catch (error) {
        sendFiles(error,response)
        return
    }
    sendFiles({type:"results",results},response)
}
/**
 * 发布评论
 * comment 的结构 {articleNum,userName,content,time}
 */
async function addComment(request, response, cookie, sendFiles, postdata) {
    let comment
    if(!userTable.hasOwnProperty(cookie.loginCookie)){
        sendFiles(new Error("请登录后再尝试"),response)
        return
    }
    try {
        //TODO:或许还该检查一下用户是否拥有这个文章的管理权
        comment=JSON.parse(postdata)
        comment.userName=userTable[cookie.loginCookie].name//根据cookie设置名字防止假冒
        comment.time=new Date().toLocaleString()
    } catch (error) {
        sendFiles(new Error("提交的信息格式不对"),response)
        return
    }
    let results
    try {
        results=await user.addComment(comment)
    } catch (error) {
        sendFiles(error,response)
        return
    }
    sendFiles({type:"results",results},response)
}
/**
 * 删除指定id的文章
 */
async function deleteComment(request, response, cookie, sendFiles, postdata){//TODO:尚未做权限验证
    let id
    try {
        id=JSON.parse(postdata).id
    } catch (error) {
        sendFiles(new Error("提交的信息格式不对"),response)
        return
    }
    let results
    try {
        results=await user.deleteComment(id)
    } catch (error) {
        sendFiles(error,response)
        return
    }
    sendFiles({type:"results",results},response)
}
/**
 * 注销   无需提交参数,直接根据cookie注销
 */
function cancellation(request, response, cookie, sendFiles, postdata){
    delete userTable[cookie.loginCookie]
    //通过设置时间过期使浏览器删除登录的cookie
    response.setHeader('Set-Cookie', "loginCookie=; expires=Thu, 01 Jan 1970 00:00:01 GMT;")
    response.end("注销成功")
}
/**
 * 获取用户信息
 */
async function getUser(request, response, cookie, sendFiles, postdata) {
    let post=JSON.parse(postdata)
    let res
    try {
        res= await user.getUser(post.name)
    } catch (error) {
        sendFiles(error,response)
        return
    }
    sendFiles(res,response)
}
/**
 * 上传文件，支持wangEdit的返回
 */
async function file(request, response, cookie, sendFiles, entireData){
    let res = {//wangEdit要求的数据回传格式
        // errno 即错误代码，0 表示没有错误。
        //       如果有错误，errno != 0，可通过下文中的监听函数 fail 拿到该错误码进行自定义处理
        errno: 0,
        // data 是一个数组，返回若干图片的线上地址
        data: []
    }
    function ranStr() {
        return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
    }
    //保存文件
    const files = fun.formFile(entireData)//解析二进制的数据
    for (let i = 0; i < files.length; i++) {
        const element = files[i];
        let path = await (new Promise((resolve, reject) => {
            const tempPatn = ranStr() + "_" + element.describe.filename
            //TODO:这里的目录应该要再初始化模块中初始化
            //TODO:理论上来说如果有人构造恶意数据这里的filename直接拼接是一个严重的漏洞 比如将name 构造为 ../之类的
            fs.writeFile(process.cwd() + "/webServer/web/file/" + tempPatn, entireData.slice(element.start, element.end), 'binary', (err) => {
                if (err)
                    reject(err)
                else {
                    //这个路径是基于web目录的TODO:应该按照config来配置
                    resolve("./file/" + tempPatn)
                }
            });
        }))
        res.data.push(path)
    }
    sendFiles(res, response);
}
/**
 * 跳转到首页的函数
 */
function index(req, response, cookie, sendFiles){//对直接访问地址的处理
    var path = ""
    // if (cookie.init) {
    //     path = this.config.index_page;
    // } else {
    //     path = this.config.welcome_page;
    //     //此处cookie的设置详见   https://blog.csdn.net/helloliuhai/article/details/18351439 https://www.cnblogs.com/ajianbeyourself/p/4900140.html
    //     //设置cookie有效期到世界末日,不允许js读取cookie
    //     response.setHeader('Set-Cookie', "init=true; expires= Fri, 31 Dec 9999 23:59:59 GMT;");
    // }
    //重定向
    response.writeHead(303, {
        'Content-Type': 'text/html',
        'Server': 'nodejs-v10.8.0_gs-webserver',
        'Location': './index.html'  //直接跳到首页
    })
    response.end()
}
/**
 * 获取当前登录用户状态
 */
function getLoginUser(request, response, cookie, sendFiles, postdata){
    sendFiles(userTable,response)
}
async function updateUser(request, response, cookie, sendFiles, postdata){
    let use=JSON.parse(postdata)
    use.id=userTable[cookie.loginCookie].id
    let res;
    user.updateUser(use).then((e)=>{
        sendFiles({message:e},response)
    }).catch((e)=>{
        if(e instanceof Error && e.errno==1062)
            sendFiles(new Error(e),response)
        else
            console.log(e);
    })
    
}
exports.function={//还需要在serverConfig 中添加路径
    "/register":register,
    "/login":login,
    "/article":upArticle,
    '/getArticle':getArticle,
    '/deleteArticle':deleteArticle,
    '/updateArticle':updateArticle,
    '/searchArticle':searchArticle,
    '/getComment':getComment,
    '/addComment':addComment,
    '/deleteComment':deleteComment,
    '/cancellation':cancellation,
    '/getUser':getUser,
    '/file':file,
    '/index':index,
    '/getLoginUser':getLoginUser,
    '/updateUser':updateUser,
}