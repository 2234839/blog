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
// user.addUser({
//     id:1,
//     name:"666",
//     password:"kkk",
//     data:{
//         a:"ddd"
//     },
//     msg:{
//         a:9999
//     }
// })
for (let index = 30; index < 60; index++) {

    user.removeUser(index)    
}
