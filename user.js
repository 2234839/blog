/**
 * 对用户的一些操作 如增删改查之类的
 */
var sql=require('./MySql');

function basicsSqlOperation(sqltext,callback){
    sql.query(sqltext,(value)=>{
        callback(value)
    })
}
exports.addUser=function(user){
    var sqltext=`INSERT INTO user VALUES (0, 
        "${user.name}",
        "${user.password}",
        "{}",
        "{}");`;
    basicsSqlOperation(sqltext,(value)=>{
        console.log(value)
    })
}
exports.removeUser=function(user){
    var sqltext=`DELETE FROM user WHERE name= "${user.name}" and password="${user.password}";`
    basicsSqlOperation(sqltext,(value)=>{
        console.log(value)
    })
}
exports.updateUser=function(user){
    var sqltext=``
    basicsSqlOperation(sqltext,(value)=>{
        console.log(value)
    })
}
exports.queryUser=function(user){
    var sqltext=``
    basicsSqlOperation(sqltext,(value)=>{
        console.log(value)
    })
}
exports.getUser=function(id,callback){
    var sqltext=`select * from user where id=${id}`
    sql.query(sqltext,(value)=>{
        console.log(value)
    })
}