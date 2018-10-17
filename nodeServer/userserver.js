/**
 * 对user.js 的功能的一些封装
 */
var fun=require('./function')
var user=require('./user')
const sqlObj=require('./sqlObj')
// var routeTable=require('./../webServer/config/serverConfig').config.routeTable
// routeTable["/register"]=register
// routeTable["/login"]=login
//最下方有一个服务监听路径的对象
var userTable={}
exports.userTable=userTable
async function getUser(request, response, cookie, sendFiles, postdata) {
    
}
/**
 * 注册功能
 * @param {object} postdata post提交的数据
 */
function register(request, response, cookie, sendFiles, postdata){
    var obj=fun.stringParse(postdata.toString())
    var use=new user.user(obj.id,obj.name,obj.password,obj.data,obj.msg)
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
    var use=new user.user(obj.id,obj.name,obj.password,obj.data,obj.msg,cookie.loginCookie)
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
    article.id=use.id
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

function cancellation(request, response, cookie, sendFiles, postdata){
    delete userTable[cookie.loginCookie]
    //通过设置时间过期使浏览器删除登录的cookie
    response.setHeader('Set-Cookie', "loginCookie=; expires=Thu, 01 Jan 1970 00:00:01 GMT;");
    response.end("注销成功")
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
}