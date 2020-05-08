const express = require('express')

const authMiddleware = require('../middleware/auth')

const { hash , pool, checkToken, crash } = require('../util')

const router = express.Router()

router.get('/', async (req, res) => {
  return res.status(200).send({
    status: 'success',
    response: {
      message: 'hello',
    },
  })
})

// Get auth token
router.post('/hello', async (req, res) => {
  try {
    const { user, pass } = req.body

    const conn = await pool

    const query = await conn.query(`SELECT * FROM user WHERE user = "${user}" AND pass = "${hash(pass)}"`)

    if (query.length === 1) {
      // If user match then give user a token
      return res.status(200).send({
        status: 'success',
        response: {
          message: 'welcome',
          data: {
            token: `${user};${hash(pass)}`,
          },
        },
      })
    } else {
      // Otherwise, reject
      return res.status(400).send({
        status: 'failure',
        response: {
          message: 'no seekers here',
        },
      })
    }
  } catch (e) {
    crash(res)
  }
})

// Blow route will be check for auth
router.use(authMiddleware)

router.get('/ping', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: {
      message: 'pong',
    },
  })
})

module.exports = router
