/**
 * 对用户的一些操作 如增删改查之类的
 */
var sql=require('./MySql');
// user对象的结构
var user={
    id:0,
    name:"ddd",
    password:"string",
    data:{},
    msg:{}
}

/**
 * 添加一个用户到数据库中
 * @param {user}} user 
 */
exports.addUser=function(user){
    //模块会将json直接转为 “a=0” 这种形式的 ，所以需要将他们序列化一下
    sql.query('INSERT INTO user VALUES (?,?,?,?,?)',[0,user.name, user.password,JSON.stringify(user.data),JSON.stringify(user.msg)],(results)=>{
        console.log(results)
    })
}
/**
 * 移除一个用户
 * @param {number} id
 */
exports.removeUser=function(id){
    sql.query('DELETE FROM user WHERE id=?', [id],(results)=>{
        console.log(results)
    })
}
/**
 * 更新用户的一些资料
 * @param {objiect}} user 完整的用户对象
 */
exports.updateUser=function(user){
    console.log(user)
    var sqltext=`UPDATE user SET 
        name="${user.name}",
        password="${user.password}",
        data="${JSON.stringify(user.data)}",
        msg="${JSON.stringify(user.msg)}" WHERE id=${user.id};`
    basicsSqlOperation(sqltext,(value)=>{
        console.log(value)
    })
}
/**
 * 查询昵称为name的用户返回一个包含这些用户的数组
 * @param {string} name 
 */
exports.queryUser=function(name){
    var sqltext=`select * from user where name=${name}`
    basicsSqlOperation(sqltext,(value)=>{
        console.log(value)
    })
}
/**
 * 返回这个用户的数据对象
 * @param {number} id 要查询用户的id
 * @param {Function} callback 回调函数
 */
exports.getUser=function(id,callback){
    var sqltext=`select * from user where id=${id}`
    sql.query(sqltext,(value)=>{
        callback(value[0])
    })
}