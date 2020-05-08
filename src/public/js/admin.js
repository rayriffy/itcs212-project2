$(document).ready(async () => {
  // Check if he is admin or not
  const isAuthenticated = await checkAuth()

  if (isAuthenticated) {
    // If it is, then he is an admin
    $('#init').toggleClass('d-none')
    $('#app').toggleClass('d-none')
    $('#auth-logout').toggleClass('d-none')
  } else {
    // Otherwise, he is not an admin
    $('#init').toggleClass('d-none')
    $('#unauthorized').toggleClass('d-none')
  }
})

// Check are you really an admin
const checkAuth = async () => {
  try {
    // Get token from LocalStorage
    const token = window.localStorage.getItem('token')
    
    // Ping to server
    const res = await fetch('/api/admin/ping', {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
      },
    }).then(o => o.json())

    // Return validity of token
    return res.response.message === 'pong'
  } catch (e) {
    return false
  }
}
