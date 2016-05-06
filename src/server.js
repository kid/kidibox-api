import fs from 'fs'
import spdy from 'spdy'
import Hapi from 'hapi'
import Inert from 'inert'

import auth from './auth'
import api from './api'

const server = new Hapi.Server({ debug: { 'request': ['error', 'uncaught'] } })
const serverOptions = {
  key: fs.readFileSync(process.env.SSL_CERTIFICATE_KEY || 'localhost.key'),
  cert: fs.readFileSync(process.env.SSL_CERTIFICATE || 'localhost.crt')
}

server.connection({
  routes: { cors: true },
  listener: spdy.createServer(serverOptions),
  port: process.env.PORT || 3000,
  tls: true
})

const good = {
  register: require('good'),
  options: {
    ops: {
      interval: 1000
    },
    reporters: {
      stdout: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ log: '*', response: '*' }]
        },
        { module: 'good-console' },
        'stdout'
      ],
      stderr: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ error: '*' }]
        },
        { module: 'good-console' },
        'stderr'
      ]
    }
  }
}

server
  .register([good, Inert, auth, api])
  .then(() => server.start())
  .then(() => server.log('info', `Server running at: ${server.info.uri}`))
  .catch((error) => {
    console.error(error.stack)
    process.exit(1)
  })
