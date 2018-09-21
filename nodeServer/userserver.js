var routeTable=require('./../webServer/config/serverConfig').config.routeTable
var fun=require('./function')
var user=require('./user')
routeTable["/register"]=register
routeTable["/login"]=login
var userTable={}
/**
 * @param {*} request 
 * @param {*} response 
 * @param {*} cookie 
 * @param {*} sendFiles 
 * @param {object} postdata post提交的数据
 */
function register(request, response, cookie, sendFiles, postdata){
    var obj=fun.stringParse(postdata.toString())
    var use=new user.user(obj.id,obj.name,obj.password,obj.data,obj.msg)
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
            userTable[d.cookies]=d
        }
    })
}
/**
 * 判断用户是否已登录
 * @param {string} cookies cookies
 */
function isLogin(cookies){
    return userTable.hasOwnProperty(cookies)
}