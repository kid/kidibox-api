import Promise from 'bluebird';
import UserService from './UserService';
import UserRepository from './UserRepository';

const Joi = Promise.promisifyAll(require('joi'));
const jwt = Promise.promisifyAll(require('jsonwebtoken'));

const registerSchema = Joi.object().keys({
  username: Joi.string().trim().empty().min(2).max(64).required(),
  password: Joi.string().trim().empty().min(8).required(),
});

const authenticateSchema = Joi.object().keys({
  username: Joi.string().trim().empty().required(),
  password: Joi.string().trim().empty().required(),
});

const jwtOptions = {
  expiresIn: '7d',
  audience: 'localhost:3000',
  issuer: 'localhost:3000',
};

function formatValidationError(error) {
  const messages = error.details.map(msg => {
    return { message: msg.message, path: msg.path };
  });

  return { messages: messages };
}

export default class TorrentController {
  userRepository: UserRepository;
  userService: UserService;

  constructor(userRepository: UserRepository, userService: UserService) {
    this.userRepository = userRepository;
    this.userService = userService;
  }

  async register(ctx) {
    try {
      const validated = await Joi.validateAsync(ctx.request.body, registerSchema);
      const user = {
        name: validated.username,
        passwordHash: await this.userService.hashPassword(validated.password),
      };

      ctx.body = await this.userRepository.create(user);
    } catch (ex) {
      if (ex.name === 'ValidationError') {
        ctx.status = 400;
        ctx.body = formatValidationError(ex);
      } else if (ex.code === '23505') {
        // Unque constraint violation, return 409 - Conflict
        ctx.status = 409;
        ctx.body = { message: 'User already exists' };
      } else {
        ctx.throw(ex);
      }
    }
  }

  async authenticate(ctx) {
    try {
      const validated = await Joi.validateAsync(ctx.request.body, authenticateSchema);
      const user = await this.userRepository.findByName(validated.username);

      if (user && await this.userService.verifyPassword(user, validated.password)) {
        const options = {
          subject: user.id,
          ...jwtOptions,
        };

        ctx.body = { token: jwt.sign({}, 'secret', options) };
      } else {
        ctx.status = 401;
        ctx.body = { message: 'Invalid username or password' };
      }
    } catch (ex) {
      if (ex.name === 'ValidationError') {
        ctx.status = 400;
        ctx.body = formatValidationError(ex);
      } else {
        ctx.throw(ex);
      }
    }
  }
}
