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
 * 
 * @param {object} user 用户对象模型
 */
function login(request, response, cookie, sendFiles, postdata){
    var obj=fun.stringParse(postdata.toString())
    var use=new user.user(obj.id,obj.name,obj.password,obj.data,obj.msg)
    user.addUser(use,(d)=>{
        if(d instanceof Error)
            sendFiles(d,response)//添加用户失败
        else{//TODO:这里是保持登录状态的cookie持续时间不该设置的这么长
            d.message+="嗨！ "+d.name+"欢迎来到神行"
            sendFiles(d,response)
        }
    })
}