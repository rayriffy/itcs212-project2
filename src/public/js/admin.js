$(document).ready(async () => {
  // Check if he is admin or not
  const isAuthenticated = await checkAuth()

  if (isAuthenticated) {
    // If it is, then he is an admin
    $('#init').toggleClass('d-none')
    $('#app').toggleClass('d-none')

    // Fetch all user
    fetchUser()
  } else {
    // Otherwise, he is not an admin
    $('#init').toggleClass('d-none')
    $('#unauthorized').toggleClass('d-none')
  }

  // Create user when button is clicked
  $('#action-user-create').click(async () => {
    $('#action-user-create').text('Creating...')
    $('#action-user-create').attr('disabled', true)
    $('#modal-user-new-failed').attr('class', 'd-none')
    $('#modal-user-new-success').attr('class', 'd-none')

    try {
      const user = $('#modal-user-new-user').val()
      const name = $('#modal-user-new-name').val()
      const pass = $('#modal-user-new-pass').val()

      // Get token from LocalStorage
      const token = window.localStorage.getItem('token')
      
      // Send to server
      const res = await fetch('/api/admin/user', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          user,
          name,
          pass,
        })
      }).then(o => o.json())

      if (res.status === 'success') {
        await fetchUser()
        $('#modal-user-new-success').toggleClass('d-none')
      } else {
        $('#modal-user-new-failed').toggleClass('d-none')
      }
    } catch {
      $('#modal-user-new-failed').toggleClass('d-none')
    } finally {
      $('#action-user-create').text('Create')
      $('#action-user-create').attr('disabled', false)
    }
  })

  // Make change to user when button is clicked
  $('#action-user-edit').click(async () => {
    $('#action-user-edit').text('Editing')
    $('#action-user-edit').attr('disabled', true)
    $('#modal-user-edit-failed').attr('class', 'd-none')

    try {
      // Get avaliable change input
      const name = $('#modal-user-edit-name').val()
      const id = $('#modal-user-edit-user-id').val()

      // Get token from LocalStorage
      const token = window.localStorage.getItem('token')

      // Send request to server
      const res = await fetch('/api/admin/user', {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          id,
          name,
        }),
      }).then(o => o.json())

      if (res.status !== 'success') throw 'failed'

      // Fetch all users
      await fetchUser()

      // Close Modal
      $('#modal-user-edit').modal('hide')
    } catch {
      $('#modal-user-edit-failed').toggleClass('d-none')
    } finally {
      $('#action-user-edit').text('Edit')
      $('#action-user-edit').attr('disabled', false)
    }
  })
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

// Fetch all user
const fetchUser = async () => {
  // Get token from LocalStorage
  const token = window.localStorage.getItem('token')

  // Get all user
  try {
    const users = await fetch('/api/admin/users', {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
      },
    }).then(o => o.json())

    $('#table-body').html(`
      ${users.response.data.map(user => `
        <tr id="table-user-${user.id}">
          <th scope="row">${user.id}</th>
          <td>${user.user}</td>
          <td>${user.name}</td>
          <td>
            <div class="d-flex">
              <div>
                <button type="button" class="btn btn-info" onclick='editUser(${JSON.stringify(user)})'>Edit</button>
              </div>
              ${token.split(';')[0] !== user.user ? `
                <div class="pl-2">
                  <button type="button" class="btn btn-danger" onclick="removeUser(${user.id})">Remove</button>
                </div>
              ` : ''}
            </div>
          </td>
        </tr>
      `).join('')}
    `)
  } catch (e) {
    console.log(e)
  }
}

const editUser = async user => {
  $('#modal-user-edit-user-id').attr('value', user.id)
  $('#modal-user-edit-name').attr('value', user.name)
  $('#modal-user-edit-user').attr('value', user.user)
  $('#modal-user-edit-pass').attr('value', user.pass)
  $('#modal-user-edit').modal('show')
}

const removeUser = async id => {
  // Get token from LocalStorage
  const token = window.localStorage.getItem('token')

  // Send delete request
  const res = await fetch(`/api/admin/user`, {
    method: 'delete',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({
      id,
    }),
  }).then(o => o.json())

  if (res.status === 'success') {
    $(`#table-user-${id}`).remove()
  }
}
