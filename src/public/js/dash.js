// Responsible for dashboard

$(document).ready(async () => {
  $('#app-search').keypress(async e => {
    if (e.keyCode === 13) {
      // Lock input
      $('#app-search').attr('disabled', true)

      // Hide dialog
      $('#movie').attr('class', 'd-none')
      $('#movie-error').attr('class', 'd-none')
      $('#movie-youtube').text('Loading YouTube trailer...')
      $('#movie-spotify').text('Loading Spotify playlist...')
      $('#movie-twitter').text('Loading tweets...')

      // Get query
      const query = $('#app-search').val()

      try {
        // Get token from LocalStorage
        const token = window.localStorage.getItem('token')

        /**
         * 1. Get movie metadata
         */

        // Get movie from query
        const res = await fetch('/api/app/movie', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          body: JSON.stringify({
            query,
          }),
        }).then(o => o.json())

        if (res.status === 'success' && res.response.data.Response === 'True') {
          const { Poster, Title, Year, Genre, Language, Director, Writer, Runtime, Actors, Plot } = res.response.data

          // Set movie poster image
          $('#movie-poster').attr('src', Poster)
          $('#movie-poster').attr('alt', Title)

          // Set movie metadata
          $('#movie-title-year').text(`${Title} (${Year})`)
          $('#movie-genre > span').text(Genre)
          $('#movie-language > span').text(Language)
          $('#movie-director > span').text(Director)
          $('#movie-writer > span').text(Writer)
          $('#movie-runtime > span').text(Runtime)
          $('#movie-actors > span').text(Actors)
          $('#movie-plot > span').text(Plot)

          // Show result
          $('#movie').toggleClass('d-none')

          // Release input in the end
          $('#app-search').attr('disabled', false)

          /**
           * 2. Get Youtube video
           */
          const getYouTubeVideo = async query => {
            try {
              // Get video data
              const youtube = await fetch('/api/app/youtube', {
                method: 'post',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': token,
                },
                body: JSON.stringify({
                  query,
                }),
              }).then(o => o.json())

              $('#movie-youtube').html(`
                <div class="embed-responsive embed-responsive-16by9">
                  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/${youtube.response.data.id.videoId}" allowfullscreen></iframe>
                </div>
              `)
            } catch {
              $('#movie-youtube').text('Failed to load YouTube video')
            }
          }

          /**
           * 3. Get Spotify playlist
           */
          const getSpotifyPlaylist = async query => {
            try {
              // Get access token
              const spotifyToken = await fetch('/api/app/spotify', {
                method: 'get',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': token,
                },
              }).then(o => o.json()).then(o => o.response.data.token)

              // Query playlist in spotify
              const playlists = await fetch(`https://api.spotify.com/v1/search?q="${query}"&type=playlist&limit=1&market=TH`, {
                method: 'get',
                headers: {
                  'Authorization': `Bearer ${spotifyToken}`,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
              }).then(o => o.json())

              const playlist = playlists.playlists.items[0]

              // Inject HTML
              $('#movie-spotify').html(`
                <iframe src="https://open.spotify.com/embed/playlist/${playlist.id}" width="100%" height="480" frameborder="0" allow="encrypted-media"></iframe>
              `)
            } catch {
              $('#movie-spotify').text('Failed to load Spotify playlist')
            }
          }

          /**
           * 4. Get Twitter tweet - Need to query from server to avoid CORS
           */
          const getTwitterTweet = async query => {
            try {
              // Get tweets
              const twiiterRes = await fetch('/api/app/twitter', {
                method: 'post',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': token,
                },
                body: JSON.stringify({
                  query,
                }),
              }).then(o => o.json())

              // Render
              $('#movie-twitter').html(`
                ${twiiterRes.response.data.rawTweets.statuses.map(status => `
                  <div class="media py-3">
                    <img src="${status.user.profile_image_url_https}" class="mr-3 rounded-circle" alt="${status.user.name}">
                    <div class="media-body">
                      <h5 class="mt-0">${status.user.name}</h5>
                      ${status.text}
                    </div>
                  </div>
                `).join('')}
                ${twiiterRes.response.data.rawTweets.statuses.length === 0 ? 'No tweets about this in last 7 days' : ''}
              `)
            } catch {
              $('#movie-twitter').text('Failed to load tweets')
            }
          }

          /**
           * 5. Execute 2, 3 and 4 asynchronously
           */
          getYouTubeVideo(Title)
          getSpotifyPlaylist(Title)
          getTwitterTweet(Title)
        } else {
          // Set detail
          $('#movie-error-title').text('Not Found')
          $('#movie-error-description').text(`We could not find movie the you asked for :(`)

          // Show result
          $('#movie-error').toggleClass('d-none')

          // Release input in the end
          $('#app-search').attr('disabled', false)
        }
      } catch (e) {
        $('#movie-error-title').text('Unexpected Error')
        $('#movie-error-description').text(`Backend server just yeet itself`)

        // Show result
        $('#movie-error').toggleClass('d-none')

        // Release input in the end
        $('#app-search').attr('disabled', false)
      }
    }
  })
})
