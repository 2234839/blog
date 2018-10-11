/**
 * 因为代码公开到了github故此处引用一个不会被上传的文件来保存密钥等数据
 * 实际使用时可直接将密钥写在此处
 */
var sql=require('./../../sql').config.mysql
 
exports.config = {
    // mysql:sql 
    // root@localhost: edxOBGhy.1:.
    mysql:{
        host: '127.0.0.1',
        user: 'root',
        password: '987456321',
        database:'Blog'
    }
}