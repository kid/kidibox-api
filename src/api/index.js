import auth from './auth'
import torrents from './torrents'

function register (server, options, next) {
  server.route(auth)
  server.route(torrents)

  next()
}

register.attributes = {
  name: 'api'
}

export default { register }
