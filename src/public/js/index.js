$(document).ready(async () => {
  $('#app').hide(0)
  $('#auth').hide(0)
  // Check if user is authenticated
  const isAuthenticated = await checkAuth()

  if (isAuthenticated) {
    // If it is, then show application
    $('#init').hide(0)
    $('#app').show(0)
  } else {
    // Otherwise, show login screen
    $('#init').hide(0)
    $('#auth').show(0)
  }
})

// Check authentication status
const checkAuth = async () => {
  try {
    // Get token from LocalStorage
    const token = window.localStorage.getItem('auth')
    
    // Ping to server
    const res = await fetch('/api/auth/ping', {
      method: 'post',
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
