import { expect } from 'chai'
import UserService from '../../src/users/UserService'

describe('UserService', () => {
  const service = new UserService()

  describe('hashPassword', () => {
    it('return a hash a password', () => {
      expect(service.hashPassword('foo')).to.eventually.be.a('string')
    })

    it('should fail given invalid parameter', () => {
      expect(() => service.hashPassword()).to.throw()
      expect(() => service.hashPassword({})).to.throw()
      expect(() => service.hashPassword(null)).to.throw()
    })

    it('should fail given an object', () => {
      expect(() => service.hashPassword({})).to.throw()
    })
  })

  describe('verifyPassword', () => {
    it('returns true when the password match', () => {
      return service.hashPassword('foo').then(hash => {
        return service.verifyPassword({ passwordHash: hash }, 'foo').then(result => {
          expect(result).to.be.true
        })
      })
    })

    it('returns false when the password does not match', () => {
      return service.hashPassword('foo').then(hash => {
        return service.verifyPassword({ passwordHash: hash }, 'bar').then(result => {
          expect(result).to.be.false
        })
      })
    })

    it('should fail given an incorrect parameters', () => {
      expect(() => service.verifyPassword()).to.throw()
      expect(() => service.verifyPassword(null, { })).to.throw()
      expect(() => service.verifyPassword(null, null)).to.throw()
      expect(() => service.verifyPassword({ }, null)).to.throw()
      expect(() => service.verifyPassword({ }, 'foo')).to.throw()
      expect(() => service.verifyPassword({ passwordHash: null })).to.throw()
      expect(() => service.verifyPassword({ passwordHash: 'foo' })).to.throw()
      expect(() => service.verifyPassword({ passwordHash: 'foo' }, { })).to.throw()
      expect(() => service.verifyPassword({ passwordHash: 'foo' }, null)).to.throw()
    })
  })
})
