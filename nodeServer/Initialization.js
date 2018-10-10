/*初始化数据库环境
 * 
 */
var sql = require('./MySql.js');
//创建用户表
var sqltext =[ `create table user
				(id int auto_increment not null primary key,
				name varchar(20) not null,
				password varchar(100),
				data LONGTEXT,
				msg LONGTEXT,
				cookies varchar(40),
				UNIQUE (name)
				);`,
// 创建文章表  describe 这tm是关键字....不能用这个为名字
				`create table article
				(num int auto_increment not null primary key,
				id int not null,
				name varchar(20),
				textname varchar(100),
				des LONGTEXT,
				content LONGTEXT
				);`,
				`CREATE TABLE comment (
					articleNum int(11) NOT NULL,
					userName varchar(20) NOT NULL,
					content text NOT NULL,
					time datetime NOT NULL
				  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`
				  ]
//创建所所有的表
sqltext.forEach(element => {
	sql.query(element, function (value) {
		console.log(value);
	});
});