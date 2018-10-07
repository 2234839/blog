/**
 * 对user.js 的功能的一些封装
 */
var fun=require('./function')
var user=require('./user')
// var routeTable=require('./../webServer/config/serverConfig').config.routeTable
// routeTable["/register"]=register
// routeTable["/login"]=login
exports.function={//还需要在serverConfig 中添加路径
    "/register":register,
    "/login":login,
    "/article":article,
    '/getArticle':getArticle,
    '/deleteArticle':deleteArticle,
    '/updateArticle':updateArticle
}
var userTable={}
/**
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
async function article(request, response, cookie, sendFiles, postdata) {
    if(!isLogin(cookie.loginCookie)){
        sendFiles(new Error("请登录后再尝试发送"),response)//请登录后在尝试发送
        return;
    }
    use=userTable[cookie.loginCookie]
    var article=JSON.parse(postdata.toString())
    sendFiles(await user.article(article,use),response)
}
/**
 * 获取文章
 */
async function getArticle(request, response, cookie, sendFiles, postdata) {
    // var post=fun.stringParse(postdata.toString) TODO:stringParse函数报错 TypeError: str.replace is not a function  找不到原因
    var post=JSON.parse(postdata)
    var results=await user.getArticle(post.start,post.end)
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
 * 修改文章的功能函数，要求postdata是article格式的json，TODO:此处未进行验证，存在安全隐患
 */
async function updateArticle(request, response, cookie, sendFiles, postdata){
    article=JSON.parse(postdata)
    const results=await user.updateArticle(article)
    let message=""
    if(results.affectedRows==1)
        message="修改成功！"
    else{
        message="修改失败！"
        console.error("修改失败",results);
    }
    sendFiles({message},response)
}