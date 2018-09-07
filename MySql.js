//先在服务器上创建一个数据库    create database Blog;
var mysql=require('mysql')
var connection = mysql.createConnection({
  host     : '39.108.235.79',
  user     : 'root',
  password : '987456321',
  database : 'Blog'
});
connection.connect();
exports.query=function(sqltext,callback){
		connection.query(sqltext, function (error, results, fields) {
    if (error) 
      throw error;
		callback(results);
	});
}