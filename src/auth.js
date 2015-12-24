import jwt from 'hapi-auth-jwt2'

function validate (decoded, request, callback) {
  return callback(null, true)
}

function register (server, options, next) {
  server.register(jwt, (err) => {
    if (err) {
      throw err
    }

    server.auth.strategy('jwt', 'jwt', {
      key: 'secret',
      validateFunc: validate
    })

    server.auth.default('jwt')
  })

  next()
}

register.attributes = {
  name: 'auth'
}

export default { register }
