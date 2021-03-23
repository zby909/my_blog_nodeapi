const { Result, query } = require('../models/connect')


const zby = async (req, res, next) => {
	let sqlres = await query(next, "SELECT * FROM user");
	if (sqlres) {
		res.json(new Result({ msg: 'zby', data: sqlres }))
	}

	// query("SELECT * FROM articlelist", '', (e, r, fields) => {
	// 	if (e) next(e);
	// 	if (r) {
	// 		res.json(new Result({ msg: 'zby', data: r }))
	// 	}
	// });
}

module.exports = zby;