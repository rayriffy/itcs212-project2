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
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token,
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
            // Get video data
            const youtube = await fetch('/api/app/youtube', {
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                token,
                query,
              }),
            }).then(o => o.json())

            console.log('youtube.response', youtube.response)

            $('#movie-youtube').html(`
              <div class="embed-responsive embed-responsive-16by9">
                <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/${youtube.response.data.id.videoId}" allowfullscreen></iframe>
              </div>
            `)
          }

          /**
           * 3. Get Spotify playlist
           */
          const getSpotifyPlaylist = async query => {
            // Get access token
            const spotifyToken = await fetch('/api/app/spotify', {
              method: 'post',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                token,
              }),
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
          }

          /**
           * 4. Execute 2 and 3 asynchronously
           */
          getYouTubeVideo(Title)
          getSpotifyPlaylist(Title)
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
