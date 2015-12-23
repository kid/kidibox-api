import jwt from 'koa-jwt'

export const options = {
  secret: 'secret',
  issuer: 'localhost:3000',
  adience: 'localhost:3000'
}

export default function register (app) {
  app.use(jwt(options).unless({
    path: [
      /^\/authenticate/,
      /^\/register/
    ]
  }))
}
