/**
 * 和数据的一些交互
 * 对用户的一些操作 如增删改查之类的
 */
var sql = require('./MySql');
exports.user=user
/**
 * user对象的构造函数
 * @param {int} id id
 * @param {string} name 用户名
 * @param {string} password 密码
 * @param {object} data data
 * @param {object} msg msg
 */
function user(id=NaN,name="",password="",data={},msg={},cookies=Math.random().toString(36).substr(2)){
    this.id=id
    this.name=name
    this.password=password
    this.data=data
    this.msg=msg
    this.cookies=cookies
}
function article(id=0,textname="",des="",content=""){
    this.id=id
    this.des=des
    this.content=content
    this.textname=textname
}
/**
 * 添加一个用户到数据库中
 * @param {object} user 包含基本信息的user对象
 * @param {Function} callback 操作成功则返回id否则返回数据库的返回信息
 */
exports.addUser = function (user, callback) {
    //模块会将json对象直接转为 “a=0” 这种形式的 ，所以需要将他们序列化一下
    exports.queryUser(user.name,(d)=>{
        if(d.length!=0){
            callback(new Error("用户已存在"))
        }else{
            sql.query('INSERT INTO user VALUES (?,?,?,?,?,?)', [0,user.name,user.password,JSON.stringify(user.data),JSON.stringify(user.msg),user.cookies], (results) => {
                querySuccess(results,callback,{id:results.insertId,message:"添加成功"},new Error("添加用户失败，原因未知"))
            })
        }
    })
}
/**
 * 登录功能
 * @param {object} user 用户模型
 */
exports.login=(user,callback)=>{
    sql.query('select * from user where (name=? and password=?) or (name=? and cookies=?)', [user.name, user.password,user.name,user.cookies], (results) => {
        if(typeof results[0]=="object")
            results[0].message="登录成功";
        querySuccess(results,callback,results[0],new Error("登录失败，请检查账号密码"))
    })
}
/**
 * 移除一个用户
 * @param {number} id
 * @param {Function} callback 回调函数
 */
exports.removeUser = function (id, callback) {
    sql.query('DELETE FROM user WHERE id=?', [id], (results) => {
        querySuccess(results,callback,"注销成功",["注销失败", results])
    })
}
/**
 * 更新用户的一些资料
 * @param {objiect}} user 完整的用户对象需要包含id属性
 * @param {Function} callback 回调函数
 */
exports.updateUser = function (user,callback) {
    sql.query('UPDATE user SET name=?,password=?,data=?,msg=? where id=?', [user.name, user.password, JSON.stringify(user.data), JSON.stringify(user.msg), user.id], (results) => {
        querySuccess(results,callback,"修改成功",["修改失败", results])
    })
}
/**
 * 查询昵称为name的用户返回一个包含这些用户的数组
 * @param {string} name 要查询的用户名字
 * @param {Function} callback 回调函数
 */
exports.queryUser = function (name,callback) {
    sql.query('select * from user where name=?', [name], (results) => {
        callback(results)
    })
}
/**
 * 返回这个用户的数据对象
 * @param {number} id 要查询用户的id
 * @param {Function} callback 回调函数
 */
exports.getUser = function (id, callback) {
    sql.query('select * from user where id=?',id, (value) => {
        callback(value[0])
    })
}
/**
 * 发布文章的函数
 * @param {*} article 文章对象
 */
exports.article = function (article,user,callback) {
    sql.query('INSERT INTO article VALUES (0,?,?,?,?,?)',[user.id,user.name,article.textname,article.des,article.content], (results) => {
        querySuccess(results,callback,{id:results.insertId,message:"发布成功"},new Error("发布文章失败，原因未知"))
    })
}
/**
 * 获取文章
 */
exports.getArticle = function (start,end,callback) {
    sql.query(`select * from article limit ${start},${end};`,0,(results) => {
        //results.message="获取文章成功"
        querySuccess(results,callback,{results},new Error("获取文章失败，原因未知"))
    })
}
/**
 * 对数据库返回的数据做一个简单的封装,简化其它地方的代码
 * @param {results} results 数据库返回的消息
 * @param {Function} callback 回调函数,会将后面的消息发送给这个回调函数
 * @param {any} okMsg 成功之后返回的消息
 * @param {array} failMsg 失败之后返回的数组
 */
function querySuccess(results,callback,okMsg,failMsg) {
    console.log(results)
    if(results==undefined ||results instanceof Error){
        callback(failMsg)
        return 
    }
    if(typeof callback!='function')
        throw new Error("参数callback应当为一个函数")
    if (results.affectedRows == 1)
        callback(okMsg)
    else if(results.length>=1)//TODO:这里是当数据来自纯粹的查询时他是没有affectendRows的，返回的是一个数组
        callback(okMsg)//TODO:所以这里的逻辑不够清晰，对情况的照顾不够周全
    else
        callback(failMsg)
}