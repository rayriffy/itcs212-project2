const path = require('path')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const server = express()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}))

server.use(cors())

server.use(express.static(path.join(__dirname, 'public')))

server.listen(3000, () => console.log('yeet'))
