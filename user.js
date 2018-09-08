/**
 * 对用户的一些操作 如增删改查之类的
 */
var sql = require('./MySql');
// user对象的结构
// var user={
//     id:0,
//     name:"ddd",
//     password:"string",
//     data:{},
//     msg:{}
// }

/**
 * 添加一个用户到数据库中
 * @param {user} user 包含基本信息的user对象
 * @param {Function} callback 操作成功则返回id否则返回数据库的返回信息
 */
exports.addUser = function (user, callback) {
    //模块会将json对象直接转为 “a=0” 这种形式的 ，所以需要将他们序列化一下
    sql.query('INSERT INTO user VALUES (?,?,?,?,?)', [0, user.name, user.password, JSON.stringify(user.data), JSON.stringify(user.msg)], (results) => {
        querySuccess(results)
        if (results.affectedRows == 1)
            callback(results.insertID)
        else
            callback("添加账户失败", results)
    })
}
/**
 * 移除一个用户
 * @param {number} id
 */
exports.removeUser = function (id, callback) {
    sql.query('DELETE FROM user WHERE id=?', [id], (results) => {
        console.log("删除用户", results)
        if (results.affectedRows == 1)
            callback("注销成功")
        else
            callback("注销失败", results)
    })
}
/**
 * 更新用户的一些资料
 * @param {objiect}} user 完整的用户对象需要包含id属性
 */
exports.updateUser = function (user) {
    sql.query('UPDATE user SET name=?,password=?,data=?,msg=? where id=?', [user.name, user.password, JSON.stringify(user.data), JSON.stringify(user.msg), user.id], (results) => {
        console.log("更新用户数据", results)
    })
}
/**
 * 查询昵称为name的用户返回一个包含这些用户的数组
 * @param {string} name 
 */
exports.queryUser = function (name) {
    sql.query('select * from user where name=', [name], (results) => {
        console.log("查询用户", results)
    })
}
/**
 * 返回这个用户的数据对象
 * @param {number} id 要查询用户的id
 * @param {Function} callback 回调函数
 */
exports.getUser = function (id, callback) {
    var sqltext = `select * from user where id=${id}`
    sql.query(sqltext, (value) => {
        callback(value[0])
    })
}
/**
 * 
 * @param {results} results 数据库返回的消息
 * @param {Function} callback 回调函数
 * @param {strign} okMsg 成功之后返回的消息
 * @param {array} failMsg 失败之后返回的数组
 */
function querySuccess(results,callback,okMsg,failMsg) {
    if (results.affectedRows == 1)
        callback(okMsg)
    else
        callback(failMsg)
}