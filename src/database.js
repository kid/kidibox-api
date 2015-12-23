import Promise from 'bluebird'
import pgp from 'pg-promise'

export default pgp({
  promiseLib: Promise
})(process.env.DATABASE_URL)
