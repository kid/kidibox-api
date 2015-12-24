import Boom from 'boom'
import Joi from 'joi'
import Jwt from 'jsonwebtoken'

import { userRepository } from '../users/UserRepository'
import { userService } from '../users/UserService'

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

      await userRepository.create(name, hash)

      return reply().code(204)
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
        const token = await Jwt.sign({}, 'secret', { subject: user.id.toString() })
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
