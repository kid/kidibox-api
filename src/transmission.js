import Promise from 'bluebird';
import Transmission from 'transmission';

const transmission = new Transmission({
  host: process.env.TRANSMISSION,
  port: 9091,
  username: 'admin',
  password: 'admin',
});

export default Promise.promisifyAll(transmission);
