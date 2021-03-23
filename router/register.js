const { Result, query } = require('../models/connect')


const register = async (req, res, next) => {
	//打印请求报文
	const param = req.body;
	const useremail = param.useremail;
	const password = param.password;

	const regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ //验证邮箱正则
	if (!regEmail.test(useremail)) {
		res.send(new Result({ msg: '请输入正确的邮箱格式！' }));
		return;
	}
	if (!useremail || !password) {
		res.send(new Result({ msg: '注册失败，邮箱地址、密码不能为空！' }));
		return;
	}

	//1、查看数据库中是否有相同用户名
	let [sqlres] = await query(next, "SELECT * FROM user WHERE qqEmail = ?", [useremail]);
	if (sqlres) {
		if (sqlres.length >= 1) {
			//2、如果有相同用户名，则注册失败，邮箱重复
			res.send(new Result({ msg: '注册失败，该邮箱已存在' }));
		} else {
			let [r] = await query(next, "INSERT INTO user(qqEmail,password) VALUES(?,?)", [useremail, password]);
			if (r) {
				if (r.affectedRows == 1) {
					res.send(new Result({ msg: '注册成功' }));
				} else {
					res.send(new Result({ msg: '注册失败' }));
				}
			}
		}
	}
}

module.exports = register;