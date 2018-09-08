/*初始化数据库环境
 * 
 */
var sql=require('./MySql.js');
var sqltext=`	create table user
				(id int auto_increment not null primary key,
				name varchar(20),
				password varchar(100),
				data LONGTEXT,
				msg LONGTEXT
				);`;
sql.query(sqltext, function(value) {
	console.log(value);
});
