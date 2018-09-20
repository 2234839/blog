var routeTable=require('./../webServer/config/serverConfig').config.routeTable
var fun=require('./function')
var user=require('./user')
routeTable["/register"]=register
routeTable["/login"]=login
var cookie=Math.random().toString(36).substr(2);
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
        else{//TODO:这里是保持登录状态的cookie持续时间不该设置的这么长
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
    console.log(cookie)
    var obj=fun.stringParse(postdata.toString())
    var use=new user.user(obj.id,obj.name,obj.password,obj.data,obj.msg,cookie.loginCookie)
    user.login(use,(d)=>{//这个d是数据库返回的user对象，在login中给它添加了message属性
        if(d instanceof Error)
            sendFiles(d,response)//添加用户失败
        else{//TODO:这里是保持登录状态的cookie持续时间不该设置的这么长
            d.message+="\n嗨！ 欢迎"+d.name+"来到神行"
            console.log("d.cookie",d.cookies,d)
            response.setHeader('Set-Cookie', "loginCookie="+d.cookies+"; expires= Fri, 31 Dec 9999 23:59:59 GMT;");
            sendFiles(d,response)
        }
    })
}