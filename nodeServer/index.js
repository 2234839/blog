var webServer=require("../webServer/server/server").server
var user = require("./user")
var userServer=require("./userserver")
var log = console.log

// setTimeout(async ()=>{
//     console.log(await user.deleteArticle(20));
//     '/deleteArticle'
// },1000)

async function test(){
    let res
    try {
        res= await user.searchArticle("  地丢  至 ")
    } catch (error) {
        console.log(error);
    }
    console.log(res);
}
test()
