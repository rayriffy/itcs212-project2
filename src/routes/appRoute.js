const express = require('express')

const fetch = require('node-fetch')

const { hash, checkToken, crash, omdbAPI, getSpotifyClient, youtubeAPI } = require('../util')
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


router.post('/spotify', async (req, res) => {
  console.log(getSpotifyClient())
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'post',
    headers: {
      'Authorization': `Basic ${getSpotifyClient()}`
    },
    form: {
      grant_type: 'client_credentials'
    },
  })

  console.log(response)
  // res.status(200).send({
  //   status: 'success',
  //   response: {
  //     message: 'obtained',
  //     data: {
  //       token: getSpotifyClient(),
  //     },
  //   },
  // })
})

router.use(middleware)

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
    console.log(e)
    crash(res)
  }
})

// Request authorization header for Spotify API

module.exports = router
