import Hapi from 'hapi'
import api from '../../src/api'
import { userRepository } from '../../src/users/UserRepository'
import { userService } from '../../src/users/UserService'

describe('(API) auth', () => {
  let _server

  function inject (url, payload) {
    return _server.inject({ method: 'POST', url, payload })
  }

  before(() => {
    _server = new Hapi.Server()
    _server.connection()
    return _server.register(api)
  })

  describe('register', () => {
    beforeEach(() => sinon.stub(userRepository, 'create'))
    afterEach(() => userRepository.create.restore())

    it('should return 204 Created on valid payload', () => {
      return inject('/register', { username: 'foo', password: 'barbarbaz' }).then((response) => {
        expect(response.statusCode).to.equal(204)
        expect(response.payload).to.be.empty
      })
    })

    it('should return 400 on missing username', () => {
      return inject('/register', { password: 'foo' }).then(response => {
        expect(response.statusCode).to.equal(400)
      })
    })

    it('should return 400 on missing password', () => {
      return inject('/register', { username: 'foo' }).then(response => {
        expect(response.statusCode).to.equal(400)
      })
    })

    it('should return 400 on invalid password', () => {
      return inject('/register', { username: 'foo', password: 'foo' }).then((response) => {
        expect(response.statusCode).to.equal(400)
        expect(response.result.validation.keys).to.include('password')
      })
    })
  })

  describe('authenticate', () => {
    beforeEach(() => sinon.stub(userRepository, 'findByName'))
    afterEach(() => userRepository.findByName.restore())

    beforeEach(() => sinon.stub(userService, 'verifyPassword'))
    afterEach(() => userService.verifyPassword.restore())

    it('should return 400 on missing username', () => {
      return inject('/authenticate', { password: 'foo' }).then(response => {
        expect(response.statusCode).to.equal(400)
      })
    })

    it('should return 400 on missing password', () => {
      return inject('/authenticate', { username: 'foo' }).then(response => {
        expect(response.statusCode).to.equal(400)
      })
    })

    it('should return the token on valid credentials', () => {
      const user = { id: 1, passwordHash: 'bar' }

      userRepository.findByName.withArgs('foo').returns(Promise.resolve(user))
      userService.verifyPassword.withArgs(user, 'bar').returns(Promise.resolve(true))

      return inject('/authenticate', { username: 'foo', password: 'bar' }).then((response) => {
        expect(response.statusCode).to.equal(200)
        expect(response.result.token).to.not.be.empty
      })
    })

    it('should return 401 on invalid user', () => {
      userRepository.findByName.withArgs('foo').returns(Promise.resolve(null))

      return inject('/authenticate', { username: 'foo', password: 'bar' }).then((response) => {
        expect(response.statusCode).to.equal(401)
      })
    })

    it('should return 401 on invalid password', () => {
      const user = { id: 1, passwordHash: 'bar' }

      userRepository.findByName.withArgs('foo').returns(Promise.resolve(user))
      userService.verifyPassword.withArgs(user, 'bar').returns(Promise.resolve(false))

      return inject('/authenticate', { username: 'foo', password: 'bar' }).then((response) => {
        expect(response.statusCode).to.equal(401)
      })
    })
  })
})
