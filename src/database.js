import Promise from 'bluebird'
import pgp from 'pg-promise'

const initializationOptions = {
  promiseLib: Promise
}

const connectionOptions = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  database: process.env.POSTGRES_DATABASE || 'kidibox',
  user: process.env.POSTGRES_USER || 'kidibox',
  password: process.env.POSTGRES_PASSWORD || 'kidibox'
}

export default pgp(initializationOptions)(connectionOptions)
