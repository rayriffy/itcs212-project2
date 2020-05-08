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
