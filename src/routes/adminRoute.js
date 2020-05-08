const express = require('express')

const adminMiddleware = require('../middleware/admin')
const authMiddleware = require('../middleware/auth')

const { pool, crash, hash } = require('../util')

const router = express.Router()

router.get('/', async (req, res) => {
  return res.status(200).send({
    status: 'success',
    response: {
      message: 'hello',
    },
  })
})

// Check validity of login
router.use(authMiddleware)

// Check is admin or not
router.use(adminMiddleware)

// Ping
router.get('/ping', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: {
      message: 'pong',
    },
  })
})

// Get all user
router.get('/users', async (req, res) => {
  try {
    const conn = await pool
    const query = await conn.query(`SELECT * FROM user WHERE 1`)

    return res.status(200).send({
      status: 'success',
      response: {
        message: 'obtained',
        data: query,
      },
    })
  } catch {}
})

// Create user
router.post('/user', async (req, res) => {
  try {
    const { user, pass, name } = req.body

    if (user === '' || pass === '' || name === '') {
      return res.status(400).send({
        status: 'failure',
        response: {
          message: 'bad args',
        },
      })
    }

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
    console.log(e)
    crash(res)
  }
})

// Delete user from record
router.delete('/user', async (req, res) => {
  try {
    const { id } = req.body

    const conn = await pool
    const query = await conn.query(`DELETE FROM user WHERE id = ${id}`)

    if (query.affectedRows !== 0) {
      res.status(200).send({
        status: 'success',
        code: 201,
        response: {
          message: 'removed',
        },
      })
    } else {
      res.status(400).send({
        status: 'failure',
        code: 401,
        response: {
          message: 'nothing to remove',
        },
      })
    }
  } catch (e) {
    crash(res)
  }
})

// Update user
router.put('/user', async (req, res) => {
  try {
    // Set req.body.id into id, then spread operators for the rest of object into update variable
    const { id, ...update } = req.body

    // TODO: Update record
    const conn = await pool
    const query = await conn.query(`UPDATE user SET ${Object.entries(update).map(([key, val]) => `${key} = "${val}"`).join(',')} WHERE id = ${id}`)

    if (query.affectedRows !== 0) {
      res.status(200).send({
        status: 'success',
        code: 201,
        response: {
          message: 'updated',
        },
      })
    } else {
      res.status(400).send({
        status: 'failure',
        code: 401,
        response: {
          message: 'nothing to update',
        },
      })
    }
  } catch (e) {
    crash(res)
  }
})

module.exports = router
