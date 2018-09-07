/**
 * 对用户的一些操作 如增删改查之类的
 */
var sql=require('./MySql');
/**
 * 基础sql查询
 * @param {string} sqltext 要执行的sql语句
 * @param {Function} callback 将sql语句的执行结果交给callback
 */
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
//根据name 查询用户
exports.queryUser=function(name){
    var sqltext=``
    basicsSqlOperation(sqltext,(value)=>{
        console.log(value)
    })
}
//根据id获取用户
exports.getUser=function(id,callback){
    var sqltext=`select * from user where id=${id}`
    sql.query(sqltext,(value)=>{
        callback(value[0])
    })
}