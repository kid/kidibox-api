import Promise from 'bluebird'
import Transmission from 'transmission'

const transmission = new Transmission({
  host: process.env.TRANSMISSION_HOST || 'transmission',
  port: parseInt(process.env.TRANSMISSION_PORT, 10) || 9091,
  username: process.env.TRANSMISSION_USERNAME || 'admin',
  password: process.env.TRANSMISSION_PASSWORD || 'admin'
})

export default Promise.promisifyAll(transmission)
