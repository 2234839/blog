/**
 * 因为代码公开到了github故此处引用一个不会被上传的文件来保存密钥等数据
 * 实际使用时可直接将密钥写在此处
 */
var sql=require('./../../sql').config.mysql

exports.config = {
    mysql:sql
    // mysql:{
    //     host: ip,
    //     user: 用户名,
    //     password: 密码,
    //     database:数据库名
    // }
}