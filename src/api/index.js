import auth from './auth'
import download from './download'
import torrents from './torrents'

function register (server, options, next) {
  server.route(auth)
  server.route(download)
  server.route(torrents)

  next()
}

register.attributes = {
  name: 'api'
}

export default { register }
