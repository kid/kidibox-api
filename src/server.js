import fs from 'fs'
import spdy from 'spdy'
import Hapi from 'hapi'

import auth from './auth'
import api from './api'

const server = new Hapi.Server({
  debug: { 'request': ['error', 'uncaught'] },
  routes: { cors: true }
})
const serverOptions = {
  key: fs.readFileSync(process.env.SSL_CERTIFICATE_KEY || 'localhost.key'),
  cert: fs.readFileSync(process.env.SSL_CERTIFICATE || 'localhost.crt')
}

server.connection({
  listener: spdy.createServer(serverOptions),
  port: process.env.PORT || 3000,
  tls: true
})

server.register(auth, (err) => {
  if (err) {
    throw err
  }
})

server.register(api, { routes: { prefix: '/api' } }, (err) => {
  if (err) {
    throw err
  }
})

server.start((err) => {
  if (err) {
    throw err
  }

  console.log('Server running at: ', server.info.uri)
})
