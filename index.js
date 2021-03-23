const { app, Result } = require('./models/connect');
const router = require('./router/router');

//这里处理全局拦截，一定要写在最上面（从上到下匹配路由）
app.all('*', (req, res, next) => {
	// res.json('服务器维护中')
	next()
});


//用户接口路由
app.use(router);


//404
app.use((req, res) => {
	res.status(404).json("404 Page NotFind");
})

//错误处理中间件
app.use((err, req, res, next) => {
	res.status(500).json(err.message);
})

app.listen(8088, () => {
	console.log('服务启动咯')
});
// res.json 以json对象的形式返回去
// res.send 以也页面的形式返回去
// res.download以文件的方式返回去，前端请求会下载此文