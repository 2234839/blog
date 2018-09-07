var user=require("./user")
var sql=require("./MySql")
var log=console.log
// for (let index = 0; index < 20; index++) {
//     user.addUser({
//         name:"阿强"+index,
//         password:Math.random().toString(36).substr(2)
//     })
// }select * from user;

// sql.query("select * from user",(d)=>{
//     console.log(d)
// })

user.getUser(1,(d)=>{
    log("用户",d)
})
