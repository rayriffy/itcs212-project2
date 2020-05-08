// Responsible for initialize page and authentication in user side

$(document).ready(async () => {
  // Check if user is authenticated
  const isAuthenticated = await checkAuth()

  if (isAuthenticated) {
    // If it is, then show application
    $('#init').toggleClass('d-none')
    $('#app').toggleClass('d-none')
    $('#auth-logout').toggleClass('d-none')
  } else {
    // Otherwise, show login screen
    $('#init').toggleClass('d-none')
    $('#auth').toggleClass('d-none')
  }

  // If login button was clicked, then login
  $('#auth-button').click(async () => {
    $('#auth-button').text('Please wait...')
    $('#auth-button').attr('disabled', true)
    $('#auth-dialog').attr('class', 'd-none')

    const user = $('#auth-user').val()
    const pass = $('#auth-pass').val()

    try {
      // Get token
      const token = await getAuthToken(user, pass)

      // Store in LocalStorage
      window.localStorage.setItem('token', token)

      // Show dashboard
      $('#auth').toggleClass('d-none')
      $('#auth-logout').toggleClass('d-none')
      $('#app').toggleClass('d-none')
    } catch {
      $('#auth-dialog').toggleClass('d-none')
      $('#auth-button').text('Login')
      $('#auth-button').attr('disabled', false)
    }
  })

  // If logout, remove token from storage and show auth screen
  $('#auth-logout > button').click(() => {
    window.localStorage.removeItem('token')
    $('#app').toggleClass('d-none')
    $('#auth-logout').toggleClass('d-none')
    $('#auth').toggleClass('d-none')
  })
})

// Check authentication status
const checkAuth = async () => {
  try {
    // Get token from LocalStorage
    const token = window.localStorage.getItem('token')
    
    // Ping to server
    const res = await fetch('/api/auth/ping', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
      }),
    }).then(o => o.json())

    // Return validity of token
    return res.response.message === 'pong'
  } catch (e) {
    return false
  }
}

// Get authentication token from server
const getAuthToken = async (user, pass) => {
  try {
    const res = await fetch('/api/auth/hello', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user,
        pass,
      }),
    }).then(o => o.json())

    return res.response.data.token
  } catch (e) {
    throw 'Invalid auth'
  }
}
