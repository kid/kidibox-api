import Promise from 'bluebird'

import Boom from 'boom'
import Joi from 'joi'

import { userRepository } from '../users/UserRepository'
import { userService } from '../users/UserService'

const jwt = Promise.promisifyAll(require('jsonwebtoken'))

const register = {
  method: 'POST',
  path: '/register',
  config: {
    auth: false,
    validate: {
      payload: {
        username: Joi.string().trim().empty().min(2).max(64).required(),
        password: Joi.string().trim().empty().min(8).required()
      }
    }
  },
  handler: async (request, reply) => {
    try {
      const name = request.payload.username
      const hash = await userService.hashPassword(request.payload.password)

      reply(await userRepository.create(name, hash))
    } catch (ex) {
      if (ex.code === '23505') {
        // Unque constraint violation, return 409 - Conflict
        reply(Boom.conflict('User already exists'))
      } else {
        reply(ex)
      }
    }
  }
}

const authenticate = {
  method: 'POST',
  path: '/authenticate',
  config: {
    auth: false,
    validate: {
      payload: {
        username: Joi.string().trim().empty().required(),
        password: Joi.string().trim().empty().required()
      }
    }
  },
  handler: async (request, reply) => {
    try {
      const user = await userRepository.findByName(request.payload.username)
      if (user && await userService.verifyPassword(user, request.payload.password)) {
        const token = await jwt.sign({}, 'secret', { subject: user.id.toString() })
        reply({ token })
      } else {
        reply(Boom.unauthorized())
      }
    } catch (ex) {
      reply(ex)
    }
  }
}

export default [register, authenticate]
