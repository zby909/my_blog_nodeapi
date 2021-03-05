const { pool, router, Result } = require('../models/connect')
const nodemailer = require('nodemailer')


const transport = nodemailer.createTransport({
	host: 'smtp.qq.com', // 服务
	port: 465, // smtp端口
	secure: true,
	auth: {
		user: '909908771@qq.com', //用户名
		pass: 'lwipotyqavcwbahi' // SMTP授权码
	}
});

const randomFns = () => { // 生成6位随机数
	let code = ""
	for (let i = 0; i < 6; i++) {
		code += parseInt(Math.random() * 10)
	}
	return code
}

const regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/ //验证邮箱正则

router.get('/', (req, res) => {
	let EMAIL = '362870287@qq.com'
	// let EMAIL = req.body.e_mail
	if (regEmail.test(EMAIL)) {
		let code = randomFns()
		transport.sendMail({
			from: '909908771@qq.com', // 发件邮箱
			to: EMAIL, // 收件列表
			subject: '验证你的电子邮件', // 标题
			html: `
					<p>你好！</p>
					<p>您正在登录张宝艺的博客</p>
					<p>你的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>
					<p>***该验证码5分钟内有效***</p>` // html 内容
		},
			function (error, data) {
				if (error) {
					transport.close(); // 如果没用，关闭连接池
				} else {
					res.json(new Result({ status: 200, msg: '发送成功' }))
				}
				// assert(!error, 500, "发送验证码错误！")
			})
	} else {
		res.json(new Result({ status: 200, msg: '请输入正确的邮箱格式！' }))
		// assert(false, 422, '请输入正确的邮箱格式！')
	}
})



// pool.getConnection((err, conn) => {
// 	conn.query("SELECT * FROM students", (e, r) => {
// 		if (e) throw error
// 		res.json(new Result({ data: r }))
// 	})
// 	pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
// })

module.exports = router;