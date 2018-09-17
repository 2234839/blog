/*初始化数据库环境
 * 
 */
var sql = require('./MySql.js');
//创建用户表
var sqltext =[ `create table user
				(id int auto_increment not null primary key,
				name varchar(20),
				password varchar(100),
				data LONGTEXT,
				msg LONGTEXT,
				cookies varchar(40)
				);`,
// 创建文章表  describe 这tm是关键字....不能用这个为名字
				`create table article
				(id int auto_increment not null primary key,
				des LONGTEXT,
				content LONGTEXT
				);`]
//创建所所有的表
sqltext.forEach(element => {
	sql.query(element, function (value) {
		console.log(value);
	});
});
`create table article(id int auto_increment not null primary key,describe LONGTEXT,content LONGTEXT);`
// sql.query(`create table article
// (id int auto_increment not null primary key,
// des LONGTEXT,
// content LONGTEXT
// );`, function (value) {
// 	console.log(value);
// });