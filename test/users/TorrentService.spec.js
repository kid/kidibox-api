import { expect } from 'chai';
import UserService from '../../src/users/UserService';

describe('UserService', () => {
  describe('hashPassword', () => {
    it('return a hash a password', () => {
      const service = new UserService();
      const hash = service.hashPassword('foo');

      expect(hash).to.eventually.be.a('string');
    });
  });
});
