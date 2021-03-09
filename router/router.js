const { router } = require('../models/connect')

const sendEmail = require('./sendEmail')
const zby = require('./zby')

router.get('/sendEmail', sendEmail);
router.get('/zby', zby)


module.exports = router