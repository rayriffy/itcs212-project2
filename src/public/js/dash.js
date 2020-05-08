// Responsible for dashboard

$(document).ready(async () => {
  $('#app-search').keypress(async e => {
    if (e.keyCode === 13) {
      // Lock input
      $('#app-search').attr('disabled', true)

      // Hide dialog
      $('#movie').attr('class', 'd-none')
      $('#movie-error').attr('class', 'd-none')

      // Get query
      const query = $('#app-search').val()

      try {
        // Get token from LocalStorage
        const token = window.localStorage.getItem('token')

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
