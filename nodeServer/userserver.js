var routeTable=require('./../webServer/config/serverConfig').config.routeTable
var fun=require('./function')
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
    var get=fun.stringParse(postdata.toString())
    console.log(get)
}