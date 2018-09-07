//先在服务器上创建一个数据库    create database Blog;
var mysql=require('mysql')
var connection = mysql.createConnection({
  host     : '39.108.235.79',
  user     : 'root',
  password : '987456321',
  database : 'Blog'
});
connection.connect();
/**
 * 提供对sql语句的编码，防范sql注入
 * @param {string} sqltext 要进行编码的sql语句
 */
exports.escape=function(sqltext){
  return mysql.escape(sqltext)
}
/**
 * 基础的sql查询方法
 * @param {sqltext} sqltext
 * @param {array} sql语句中的参数数组
 * @param {Function} callback 返回查询结果
 */
exports.query=function(sqltext,array,callback){
  connection.query(sqltext,array,function(err, results) {
    if(err)
      console.log(err)
    callback(results)
  });
} 


