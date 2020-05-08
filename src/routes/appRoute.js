const express = require('express')

const fetch = require('node-fetch')

const {
  crash,
  getSpotifyToken,
  getTwitterToken,
  omdbAPI,
  youtubeAPI
} = require('../util')
const middleware = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  return res.status(200).send({
    status: 'success',
    response: {
      message: 'hello',
    },
  })
})

router.use(middleware)

// Get movie metadata
router.post('/movie', async (req, res) => {
  const { query = '' } = req.body

  try {
    const movie = await fetch(omdbAPI(query)).then(o => o.json())

    if (movie.Response !== 'False') {
      return res.status(200).send({
        status: 'success',
        response: {
          message: 'obtained',
          data: movie,
        },
      })
    } else {
      return res.status(400).send({
        status: 'failed',
        response: {
          message: 'not found',
        },
      })
    }
  } catch (e) {
    crash(res)
  }
})

// Request authorization header for Spotify API
router.post('/spotify', async (req, res) => {
  try {
    const token = await getSpotifyToken()

    res.status(200).send({
      status: 'success',
      response: {
        message: 'obtained',
        data: {
          token,
        },
      },
    })
  } catch (e) {
    crash(res)
  }
})

// Get YouTube trailer based on query
router.post('/youtube', async (req, res) => {
  try {
    const { query } = req.body

    const youtube = await fetch(youtubeAPI(query)).then(o => o.json())

    res.status(200).send({
      status: 'success',
      response: {
        message: 'obtained',
        data: youtube.items[0],
      },
    })
  } catch (e) {
    crash(res)
  }
})

// Get twitter token
router.post('/twitter', async (req, res) => {
  try {
    const token = await getTwitterToken()

    console.log(token)

    res.status(200).send({
      status: 'success',
      response: {
        message: 'obtained',
        data: {
          token,
        },
      },
    })
  } catch (e) {
    crash(res)
  }
})

module.exports = router
