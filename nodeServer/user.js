/**
 * 和数据的一些交互
 * 对用户的一些操作 如增删改查之类的
 */
var sql = require('./MySql');
/**
 * 添加一个用户到数据库中，异步函数
 * @param {object} user 包含基本信息的user对象
 * @returns {Promise} Promise对象
 */
exports.addUser = function (user) {
    return new Promise((resolve,reject)=>{
        //模块会将json对象直接转为 “a=0” 这种形式的 ，所以需要将他们序列化一下
        var results=sql.query('INSERT INTO user set ?', user)
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
 * @param {int} id 要查询用户的id
 * @returns {Promise} Promise对象
 */
exports.getUser =async function (name) {
    return (await sql.query("SELECT * FROM `用户` WHERE `用户`.name=?",name))[0]
}
/**
 * 发布文章的函数
 * @param {*} article 文章对象
 * @param {object} user 用户模型
 * @returns {Promise} Promise对象
 */
exports.article = function (article) {
    return new Promise((resolve,reject)=>{
        sql.query('INSERT INTO article set ?',article)
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
    //联合查询 添加上用户头像的路径 `user`.avatar
    var results=results=await sql.query('SELECT * FROM `文章` limit ?,?;', [start, end])
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
exports.getTableNum =async function (tableNum) {//TODO: await 会将错误的结果直接抛出，这里曾经偶发过,故应该弄一个更完善的catch机制
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
/**
 * 修改文章
 * @param {object} article 文章对象
 */
exports.updateArticle=async (article)=>{
    return await sql.query('UPDATE article SET ? where num=?',[article,article.num])
}
/**
 * 模糊搜索article表的textname des content字段
 * @param {string} str 要查询的关键字 可以用空格隔开
 * @param {boolen} isnum 如果为true则函数返回符合条件的文章数量，否则返回查询结果集
 * @param {int} start 分页的开始
 * @param {int} end 分页的结束
 */
exports.searchArticle=async (str,isnum,start=0,end=9)=>{
    const array=str.split(' ').filter(x=>{//关键词数据
        return x.length>0 //过滤空数组
    }) 
    const field=['textname','content','des']//允许查询的字段数组
    let sqlText='select * from article where  '
    let par=[]//存放sql语句中 ？代表的值，防止sql注入
    if(isnum){
        sqlText='select count(*) from article where '
    }
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < field.length; j++) {
            if(i==0 && j==0)//where 后面不能直接接or
                sqlText+=`${field[j]} like ?`
            else
                sqlText+=` or ${field[j]} like ?`
            par.push("%"+array[i]+"%")//这个%不会被过滤，放前面也不知道怎么放
        }
    }
    if(isnum){//返回符合条件的有多少条
        return (await sql.query(sqlText,par))[0]['count(*)']
    }//返回结果集
    par.push(start)
    par.push(end)
    return await sql.query(sqlText+" limit ?,?",par)
}

/**
 * 获取文章的评论
 * @param {int} articleNum 文章编号
 */
exports.getComment=async (articleNum)=>{//联合查询添加了头像字段
    return await sql.query('select comment.*,`user`.avatar from comment,user where articleNum = ? and `comment`.userName=`user`.`name` ;',articleNum)
}
/**
 * 提交评论
 * @param {objiect} comment 评论对象 {articleNum,userName,content,time}
 */
exports.addComment=async (comment)=>{
    const array=[comment.articleNum,comment.userName,comment.content,comment.time]
    return await sql.query(`INSERT INTO comment (articleNum,userName,content,time) VALUES (?,?,?,?)`,array)
}
/**
 * 删除指定id的评论
 * @param {int} id
 */
exports.deleteComment=async (id)=>{
    return await sql.query(`delete from comment where id=?`,id)
}