/**
 * 对user.js 的功能的一些封装
 */
var fun=require('./function')
var user=require('./user')
// var routeTable=require('./../webServer/config/serverConfig').config.routeTable
// routeTable["/register"]=register
// routeTable["/login"]=login
exports.function={
    "/register":register,
    "/login":login,
    "/article":article,
    '/getArticle':getArticle
}
var userTable={}
/**
 * @param {object} postdata post提交的数据
 */
function register(request, response, cookie, sendFiles, postdata){
    var obj=fun.stringParse(postdata.toString())
    var use=new user.user(obj.id,obj.name,obj.password,obj.data,obj.msg)
    console.log(use);
    
    user.addUser(use,(d)=>{
        if(d instanceof Error)
            sendFiles(d,response)//添加用户失败
        else{
            d.message+=",您的id："+d.id
            sendFiles(d,response)
        }
    })
}
/**
 * 登录功能
 * @param {object} user 用户对象模型
 */
function login(request, response, cookie, sendFiles, postdata){
    var obj=fun.stringParse(postdata.toString())
    var use=new user.user(obj.id,obj.name,obj.password,obj.data,obj.msg,cookie.loginCookie)
    user.login(use,(d)=>{//这个d是数据库返回的user对象，在login中给它添加了message属性
        if(d instanceof Error)
            sendFiles(d,response)//添加用户失败
        else{//TODO:这里是保持登录状态的cookie持续时间不该设置的这么长
            d.message+="\n嗨！ 欢迎"+d.name+"来到神行"
            response.setHeader('Set-Cookie', "loginCookie="+d.cookies+"; expires= Fri, 31 Dec 9999 23:59:59 GMT;");
            delete d.password
            sendFiles(d,response)
            userTable[d.cookies]=d//将此用户的cookie及个人信息记入内存
        }
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
function article(request, response, cookie, sendFiles, postdata) {
    if(!isLogin(cookie.loginCookie)){
        sendFiles(new Error("请登录后再尝试发送"),response)//请登录后在尝试发送
        return;
    }
    use=userTable[cookie.loginCookie]
    var article=JSON.parse(postdata.toString())
    // article.des=decodeURI(article.des);
    // article.content=decodeURI(article.content);
    user.article(article,use,(d)=>{
        console.log(d)
        sendFiles(d,response)
    })
}
/**
 * 获取文章
 */
function getArticle(request, response, cookie, sendFiles, postdata) {
    // var post=fun.stringParse(postdata.toString) TODO:stringParse函数报错 TypeError: str.replace is not a function  找不到原因
    var post=JSON.parse(postdata)
    user.getArticle(post.start,post.end,(d)=>{
        if(d instanceof Error){
            d.message="获取文章失败，大概率是超出范围了"
        }else{
            d.type="results"
            d.message="获取文章成功"
        }
        sendFiles(d,response)
    })
}