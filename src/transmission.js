import Promise from 'bluebird';
import Transmission from 'transmission';

const transmission = new Transmission({
  host: '192.168.99.100',
  port: 32769,
  username: 'admin',
  password: 'admin',
});

export default Promise.promisifyAll(transmission);
