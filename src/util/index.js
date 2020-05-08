const mysql = require('promise-mysql')
const dotenv = require('dotenv')
const crypto = require('crypto')
const fetch = require('node-fetch')

dotenv.config()
const {
  MYSQL_HOST = 'localhost',
  MYSQL_PORT = 3306,
  MYSQL_USER = 'user',
  MYSQL_PASS = 'pass',
  MYSQL_DATABASE = 'db',
  HASH_SECRET = 'default',
  OMDB_API_KEY = 'default',
  SPOTIFY_CLIENT_ID = 'default',
  SPOTIFY_CLIENT_SECRET = 'default',
  GOOGLE_API_KEY = 'default',
  TWITTER_API_KEY = 'default',
  TWITTER_API_SECRET_KEY = 'default',
} = process.env

// Export ready pool connection
const pool = mysql.createPool({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASS,
  database: MYSQL_DATABASE,
})
exports.pool = pool

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

// Check token, if invalid then return null
exports.checkToken = async token => {
  try {
    const [user, pass] = token.split(';')
    const conn = await pool
    const query = await conn.query(`SELECT * FROM user WHERE user = "${user}" AND pass = "${pass}"`)

    return query.length === 1 ? query[0] : null
  } catch {
    return null
  }
}

// Get api enpoint for OMDB API
exports.omdbAPI = query => `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t="${query}"`

// Get spotify token
exports.getSpotifyToken = async () => {
  const client = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')

  const res = await fetch('https://accounts.spotify.com/api/token?grant_type=client_credentials', {
    method: 'post',
    headers: {
      'Authorization': `Basic ${client}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(o => o.json())

  return res.access_token
}

// Get api endpoint for search youtube video
exports.youtubeAPI = query => `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q="${query} movie trailer official"&regionCode=th&key=${GOOGLE_API_KEY}`

exports.getTwitterToken = async () => {
  const client = Buffer.from(`${TWITTER_API_KEY}:${TWITTER_API_SECRET_KEY}`).toString('base64')

  const res = await fetch('https://api.twitter.com/oauth2/token?grant_type=client_credentials', {
    method: 'post',
    headers: {
      'Authorization': `Basic ${client}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(o => o.json())

  return res.access_token
}
