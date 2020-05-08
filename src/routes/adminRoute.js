const express = require('express')

const adminMiddleware = require('../middleware/admin')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  return res.status(200).send({
    status: 'success',
    response: {
      message: 'hello',
    },
  })
})

router.use(authMiddleware)
router.use(adminMiddleware)

router.get('/ping', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: {
      message: 'pong',
    },
  })
})

module.exports = router
