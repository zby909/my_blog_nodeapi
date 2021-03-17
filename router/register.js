const { Result, pool } = require('../models/connect')


function register(req, res) {
	//打印请求报文
	logger.info(req.body);
	const param = req.body;
	const useremail = param.useremail;
	const password = param.password;
	const randomFns = param.randomFns;

	const regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ //验证邮箱正则
	if (!regEmail.test(useremail)) {
		res.send(new Result({ msg: '请输入正确的邮箱格式！' }));
		return;
	}
	if (!useremail || !password || !randomFns) {
		res.send(new Result({ msg: '注册失败，邮箱地址、密码、验证码不能为空！' }));
		return;
	}

	//1、查看数据库中是否有相同用户名
	pool.getConnection((err, conn) => {
		conn.query("SELECT * FROM user WHERE qqEmail = ?", [useremail], (error, res, fields) => {
			if (error) throw error;
			if (res.length >= 1) {
				//2、如果有相同用户名，则注册失败，邮箱重复
				res.send(new Result({ msg: '注册失败，该邮箱已存在' }));
			} else {
				conn.query("INSERT INTO user(useremail,password,randomFns) VALUES(?,?,?)", [useremail, password, randomFns], (error, res, fields) => {
					if (error) throw error;
					//3、如果没有相同用户名，并且有一条记录，则注册成功
					if (res.affectedRows == 1) {
						response = new Result({ msg: '注册成功' });
						res.send(response);
					} else {
						response = new Result({ msg: '注册失败' });
						res.send(response);
					}
				});
			}
		})
		pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
	})
}

module.exports = register;