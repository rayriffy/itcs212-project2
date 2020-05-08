const path = require('path')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const apiRoute = require('./routes/api')

const server = express()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({
  extended: true
}))

server.use(cors())

server.use(express.static(path.join(__dirname, 'public')))

server.use('/api', apiRoute)

server.listen(3000, () => console.log('running at 3000'))
