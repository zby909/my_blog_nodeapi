const express = require('express')
const app = express()
const router = express.Router();
const mysql = require('mysql')

// 解析参数
const bodyParser = require('body-parser')
// json请求
app.use(bodyParser.json())
// 表单请求
app.use(bodyParser.urlencoded({ extended: false }))

const option = {
	host: '47.103.43.251',
	user: 'zby',
	password: '909908',
	port: '3306',
	database: 'gname',
	connectTimeout: 5000, //连接超时
	multipleStatements: false //是否允许一个query中包含多条sql语句
}

function Result({ status = 0, msg = '', data = null }) {
	this.status = status;
	this.msg = msg;
	this.data = data;
}

// 断线重连机制
let pool;
function repool() {
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
}
repool()

module.exports = { app, router, Result, pool }