//先在服务器上创建一个数据库    create database Blog;
// mysql 的中文文档 https://www.oschina.net/translate/node-mysql-tutorial?print

//  mysqladmin -uroot -p密码 processlist   终端使用这个命令可以查看连接数及活动状态

var mysql = require('mysql')
const config = require('./nodeServerConfig').config
//练手的话只使用一个也没什么问题
//var connection = mysql.createConnection(config.mysql);
//使用连接池可以更好的发挥mysql 的能力，并且使用连接池会自动连接
const pool = mysql.createPool(config.mysql)
/**
 * 提供对sql语句的编码，防范sql注入
 * @param {string} sqltext 要进行编码的sql语句
 */
exports.escape = function (sqltext) {
	return mysql.escape(sqltext)
}
/**
 * 基础的sql查询方法
 * @param {sqltext} sqltext sql语句
 * @param {array} array sql语句中的参数数组
 * @returns {Promise} Promise对象
 * //这里不可以直接将connection传过去给其他程序使用，
 * //貌似是因为它内部的一些this的指向有些问题，所以最好在这里直接处理，由其他函数传参数
 */
exports.query = function (sqltext, array) {
	return new Promise((resolve, reject) => {
		//方便 但每次随机取connection
		pool.query(sqltext, array, function (err, rows, fields) {
			if (err)
				switch (err.errno) {
					case 'EHOSTUNREACH':
						console.error('连接数据库失败',err.message)
					case '1366':
						console.error('插入数据编码与数据库字段字符集不一致',err.message)
					case 'ECONNREFUSED':
						console.error('连接数据库失败',err.message)
					default:
						console.log(err, rows, fields);
						reject(err)
				}
			resolve(rows)
		});
		//下面这种方法如果愿意的话 可以让查询在同一conn中执行
		// pool.getConnection((err, conn) => {
		// 	if (err) {
		// 		throw err
		// 	} else {
		// 		conn.query(sqltext, array, function (err, results) {
		// 			conn.release(); //释放连接
		// 			if (err)
		// 				reject(err)
		// 			resolve(results)
		// 		});
		// 	}
		// })
		//原先只是用一个连接的时候使用的方法
		// connection.query(sqltext,array,function(err, results) {
		//   if(err)
		//     reject(err)
		//   resolve(results)
		// });
	})
}
