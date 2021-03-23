const { router } = require('../models/connect')

const sendEmail = require('./sendEmail')
const zby = require('./zby')
const register = require('./register')

router.get('/sendEmail', sendEmail);
router.get('/zby', zby);
router.post('/register', register);


module.exports = router