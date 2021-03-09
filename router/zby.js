const { Result, pool } = require('../models/connect')


const zby = (req, res) => {
	res.json(new Result({ msg: 'zby', data: { name: 'zby', age: 12 } }))
}

module.exports = zby;