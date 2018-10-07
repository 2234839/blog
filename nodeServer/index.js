var webServer=require("../webServer/server/server").server
var user = require("./user")
var userServer=require("./userserver")
var log = console.log
// user.getUser(60,(d)=>{
//     console.log(d)
// }
setTimeout(()=>{
    user.getArticle().then((a)=>{
        console.log(a);
        
    })
},1000)
