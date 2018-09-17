var routeTable=require('./../webServer/config/serverConfig').config.routeTable
var fun=require('./function')
var user=require('./user')
routeTable["/register"]=register
/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} cookie 
 * @param {*} sendFiles 
 * @param {object} postdata post提交的数据
 */
function register(request, response, cookie, sendFiles, postdata){
    var use=fun.stringParse(postdata.toString())
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
 * 
 * @param {object} user 用户对象模型
 */
function login(user){

}