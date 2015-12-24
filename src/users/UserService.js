import scrypt, { paramsSync } from 'scrypt'

const scryptParameters = paramsSync(0.1)

export default class UserService {
  hashPassword (password: string) {
    return scrypt.kdf(password, scryptParameters).then(result => result.toString('hex'))
  }

  verifyPassword (user: { passwordHash: string }, password: string) {
    return scrypt.verifyKdf(new Buffer(user.passwordHash, 'hex'), password)
  }
}

export const userService = new UserService()
