const express = require('express')
const router = express.Router()

const {
  messagepost,
  messageget,
  addchats,
  removechats,
  givechats,
  messagedeleate,
} = require('../controlers/message')

router.post('/messagepost', messagepost)
router.post('/messageget', messageget)
router.patch('/addchats', addchats)
router.patch('/removechats', removechats)
router.get('/givechats', givechats)
router.delete('/messagedeleate', messagedeleate)
module.exports = router
