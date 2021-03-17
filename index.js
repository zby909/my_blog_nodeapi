const { app, Result } = require('./models/connect')
const router = require('./router/router')

app.all('*', (req, res, next) => {
	//这里处理全局拦截，一定要写在最上面
	// res.json(new Result({ msg: '服务器维护中' }))
	next()
})
app.use(router)

app.listen(8088, () => {
	console.log('服务启动咯')
})
// res.json 以json对象的形式返回去
// res.send 以也页面的形式返回去
// res.download以文件的方式返回去，前端请求会下载此文