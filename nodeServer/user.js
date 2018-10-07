/**
 * 和数据的一些交互
 * 对用户的一些操作 如增删改查之类的
 */
var sql = require('./MySql');
exports.user = user
/**
 * user对象的构造函数
 * @param {int} id id
 * @param {string} name 用户名
 * @param {string} password 密码
 * @param {object} data data
 * @param {object} msg msg
 */
function user(id = NaN, name = null, password = null, data = {}, msg = {}, cookies = Math.random().toString(36).substr(2)) {
    this.id = id
    this.name = name
    this.password = password
    this.data = data
    this.msg = msg
    this.cookies = cookies
}
function article(id = 0, textname = "", des = "", content = "") {
    this.id = id
    this.des = des
    this.content = content
    this.textname = textname
}
/**
 * 添加一个用户到数据库中，异步函数
 * @param {object} user 包含基本信息的user对象
 * @returns {Promise} Promise对象
 */
exports.addUser = function (user) {
    return new Promise((resolve,reject)=>{
        //模块会将json对象直接转为 “a=0” 这种形式的 ，所以需要将他们序列化一下
        var results=sql.query('INSERT INTO user VALUES (?,?,?,?,?,?)', [0, user.name, user.password, JSON.stringify(user.data), JSON.stringify(user.msg), user.cookies])
        results.then((results)=>{
            results.message="注册成功。"
            resolve(results)
        })
        .catch((err)=>{
            reject(new Error("注册失败，此用户名已存在！"))
        })
    })
}
/**
 * 登录功能
 * @param {object} user 用户模型
 * @returns {Promise} Promise对象
 */
exports.login = (user) => {
    return new Promise((resolve,reject)=>{
        var results=sql.query('select * from user where (name=? and password=?) or (name=? and cookies=?)', [user.name, user.password, user.name, user.cookies])
        results.then((results)=>{
            results[0].message = "登录成功";
            resolve(results[0])
        })
        .catch((err)=>{
            reject(new Error("登录失败，请检查账号密码！"))
        })
    })
}
/**
 * 移除一个用户
 * @param {number} id
 * @returns {Promise} Promise对象
 */
exports.removeUser = function (id) {
    return new Promise((resolve,reject)=>{
        sql.query('DELETE FROM user WHERE id=?', [id]).then((results) => {
            if(results.affectedRows==1)
                resolve("删除账户成功")
            reject("删除账户失败")
        })
    })
    
}
/**
 * 更新用户的一些资料
 * @param {objiect}} user 完整的用户对象需要包含id属性
 * @returns {Promise} Promise对象
 */
exports.updateUser = function (user) {
    return new Promise((resolve,reject)=>{
        sql.query('UPDATE user SET name=?,password=?,data=?,msg=? where id=?', [user.name, user.password, JSON.stringify(user.data), JSON.stringify(user.msg), user.id])
        .then((results) => {
            if(results.affectedRows==1)
                resolve("修改成功")
            reject("修改失败")
        })
    })
}
/**
 * 查询昵称为name的用户返回一个包含这些用户的数组
 * @param {string} name 要查询的用户名字
 * @returns {Promise} Promise对象
 */
exports.queryUser = function (name) {
    return new Promise((resolve,reject)=>{
        sql.query('select * from user where name=?', [name])
        .then((results) => {
            resolve(results)
        })
    })
}
/**
 * 返回这个用户的数据对象
 * @param {number} id 要查询用户的id
 * @returns {Promise} Promise对象
 */
exports.getUser = function (id, callback) {
    return new Promise((resolve,reject)=>{
        sql.query('select * from user where id=?', id)
        .then((results) => {
            resolve(results[0])
        })
    })
}
/**
 * 发布文章的函数
 * @param {*} article 文章对象
 * @param {object} user 用户模型
 * @returns {Promise} Promise对象
 */
exports.article = function (article, user) {
    return new Promise((resolve,reject)=>{
        sql.query('INSERT INTO article VALUES (0,?,?,?,?,?)', [user.id, user.name, article.textname, article.des, article.content])
        .then((results) => {
            if(results.insertId!=0){
                resolve({
                    id: results.insertId,
                    message: "发布成功" 
                })
            }
            reject(new Error("发布文章失败，原因未知"))
        })
    })
}
/**
 * 获取文章返回一个对象，里面包含results[数据库返回的列表]以及num->article的总行数,当数据库返回的是空数据组时query会自动返回error
 * @returns {Promise} Promise对象
 */
exports.getArticle =async function (start = 0, end = 10) {
    var num=await exports.getTableNum("article")
    // ORDER BY num desc 降序排列来从后面开始取
    var results=await sql.query(`select * from article ORDER BY num desc limit ?,?`, [start, end])
    return {results,num}
}
/**
 * 获取指定编号的文章
 * @param {int} num 文章编号
 */
exports.getArticleNum =async function (num) {
    var results=await sql.query(`select * from article where num=?`, num)
    return results[0]
}
/**
 * 获取一张表有多少行
 * @param {string} tableNum 表名
 * @returns {Promise} Promise对象,resolve返回行数
 */
exports.getTableNum =async function (tableNum) {
    var results=await sql.query(`select count(*) from ${tableNum};`, 0)
    return results[0]["count(*)"]
}
/**
 * 删除指定文章
 * @param {int} num 文章编号
 * @returns 返回是否成功
 */
exports.deleteArticle =async function (num) {
    var results=await sql.query(`DELETE FROM article WHERE (num=?)`, num)
    if(results.affectedRows==1)
        return "删除成功"
    return "删除失败"
}

exports.updateArticle=async (article)=>{
    return await sql.query('UPDATE article SET num=?,id=?,name=?,textname=?,des=?,content=? where num=?',
        [article.num,article.id,article.name,article.textname,article.des,article.content,article.num])
    
}