//先在服务器上创建一个数据库    create database Blog;
var mysql=require('mysql')
const config=require('./nodeServerConfig').config

var connection = mysql.createConnection(config.mysql);
try {
  connection.connect();
} catch (error) {
  console.error("致命性错误，无法连接数据库");
}

/**
 * 提供对sql语句的编码，防范sql注入
 * @param {string} sqltext 要进行编码的sql语句
 */
exports.escape=function(sqltext){
  return mysql.escape(sqltext)
}
/**
 * 基础的sql查询方法
 * @param {sqltext} sqltext sql语句
 * @param {array} array sql语句中的参数数组
 * @param {Function} callback 返回查询结果
 * //这里不可以直接将connection传过去给其他程序使用，
 * //貌似是因为它内部的一些this的指向有些问题，所以最好在这里直接处理，由其他函数传参数
 */
exports.query=function(sqltext,array,callback){
  connection.query(sqltext,array,function(err, results) {
    if(err)
      console.error(err, results)
    callback(results?results:err)
  });
}