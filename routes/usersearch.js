const express = require('express')
const router = express.Router()

const { getuser } = require('../controlers/search')

router.route('/').get(getuser)

module.exports = router
