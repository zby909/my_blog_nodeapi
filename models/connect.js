const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');

// 解析参数
const bodyParser = require('body-parser');
console.log(bodyParser);
// json请求
app.use(bodyParser.json());
// 表单请求
app.use(bodyParser.urlencoded({ extended: false }));

const option = {
	host: '47.103.43.251',
	user: 'zby',
	password: '909908',
	port: '3306',
	database: 'vue_blog',
	connectTimeout: 5000, //连接超时
	multipleStatements: false //是否允许一个query中包含多条sql语句
};

function Result({ code = 0, msg = '', data = null }) {
	this.code = code;
	this.msg = msg;
	data ? this.data = data : '';
};

// 断线重连机制
let pool;
(function repool() {
	// 创建连接池
	pool = mysql.createPool({
		...option,
		waitForConnections: true, //当无连接池可用时，等待（true）还是抛错（false）
		connectionLimit: 100, //连接数限制
		queueLimit: 0 //最大连接等待数（0为不限制）
	})
	pool.on('error', err => {
		err.code === 'PROTOCOL_CONNECTION_LOST' && setTimeout(repool, 2000)
	})
	app.all('*', (_, __, next) => {
		pool.getConnection(err => {
			err && setTimeout(repool, 2000) || next()
		})
	})
}());
// repool()

// const query = (sql, sqlParams) => {
// 	// 返回一个 Promise
// 	pool.getConnection((err, conn) => {
// 		if (err) {
// 			return [null, err];
// 		} else {
// 			conn.query(sql, sqlParams, (err, qres, fields) => {
// 				if (err) {
// 					return [null, err];
// 				} else {
// 					return [qres, null];
// 				}
// 			});
// 		}
// 		// conn.release(); // not work!!!
// 		pool.releaseConnection(conn);
// 	});

// }

//发起mysql请求 是否监听该链接错误 查询语句 查询参数
const query = (next, sql, sqlParams) => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, conn) => {
			if (err) {
				reject(err)
			} else {
				conn.query(sql, sqlParams, (err, res, fields) => {
					if (err) {
						reject(err)
					} else {
						resolve([res, null])
					}
				});
			}
			// conn.release(); // not work!!!
			pool.releaseConnection(conn);
		});
	}).catch((err) => {
		if (next) {
			next(err);
		}
		return [null, err]
	})
}

module.exports = { app, router, Result, query }