const express = require('express')

const authRoute = require('./authRoute')
const appRoute = require('./appRoute')

const router = express.Router()

router.use('/auth', authRoute)
router.use('/app', appRoute)

module.exports = router
