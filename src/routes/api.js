const express = require('express')

const authRoute = require('./authRoute')
const appRoute = require('./appRoute')
const adminRoute = require('./adminRoute')

const router = express.Router()

router.use('/auth', authRoute)
router.use('/app', appRoute)
router.use('/admin', adminRoute)

module.exports = router
