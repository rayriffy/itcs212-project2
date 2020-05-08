const express = require('express')

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

// Test token
router.get('/ping', async (req, res) => {
  try {
    const { authorization } = req.headers

    // Request user data by token
    const user = await checkToken(authorization)

    if (user !== null) {
      return res.status(200).send({
        status: 'success',
        response: {
          message: 'pong',
        },
      })
    } else {
      return res.status(400).send({
        status: 'failure',
        response: {
          message: 'foo',
        },
      })
    }
  } catch (e) {
    crash(res)
  }
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

// Create user
router.post('/newbie', async (req, res) => {
  try {
    const { user, pass, name } = req.body

    const conn = await pool

    // Check no account dup
    const acc = await conn.query(`SELECT * FROM user WHERE user = "${user}"`)

    if (acc.length === 0) {
      // If not, create account
      await conn.query(`INSERT INTO user (user, pass, name) VALUES ("${user}", "${hash(pass)}", "${name}")`)

      return res.status(200).send({
        status: 'success',
        response: {
          message: 'created',
        },
      })
    } else {
      // Otherwise, reject
      return res.status(400).send({
        status: 'failure',
        response: {
          message: 'account dupe',
        },
      })
    }
  } catch (e) {
    crash(res)
  }
})

module.exports = router
