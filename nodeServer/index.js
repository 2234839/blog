var webServer=require("../webServer/server/server").server
var user = require("./user")
var log = console.log
user.getUser(60,(d)=>{
    console.log(d)
})