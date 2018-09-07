/**
 * 对用户的一些操作 如增删改查之类的
 */
var sql=require('./MySql');
exports.addUser=function(user){
    var sqltext=`INSERT INTO user VALUES (0, 
        "${user.name}",
        "${user.password}",
        "{}",
        "{}");`;
    sql.query(sqltext,(value)=>{
        console.log(value)
    })
}
exports.removeUser=function(user){
    var sqltext=`DELETE FROM user WHERE name= "${user.name}" and password="${user.password}";`
    sql.query(sqltext,(value)=>{
        
    })
    
}
exports.updateUser=function(user){
    var sqltext=``
    sql.query(sqltext,(value)=>{

    })
}
exports.queryUser=function(user){
    var sqltext=``
    sql.query(sqltext,(value)=>{
        
    })
}