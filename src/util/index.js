const mysql = require('promise-mysql')
const dotenv = require('dotenv')

dotenv.config()
const {
  MYSQL_HOST = 'localhost',
  MYSQL_PORT = 3306,
  MYSQL_USER = 'user',
  MYSQL_PASS = 'pass',
  MYSQL_DATABASE = 'hw4',
  HASH_SECRET = 'default',
} = process.env

// Export ready pool connection
exports.pool = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASS,
  database: MYSQL_DATABASE,
})

// Send crash signal
exports.crash = (res) => res.status(500).send({
  status: 'failure',
  code: 701,
  response: {
    message: 'crash',
  },
})

// HMAC hash function with secret bundled
exports.hash = str => crypto.createHmac('sha256', HASH_SECRET).update(str).digest('hex')
