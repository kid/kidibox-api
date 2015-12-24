import database from '../database'

export default class UserRepository {
  create (name: string, passwordHash: string) {
    return database.one(
      'INSERT INTO users ("name", "passwordHash") VALUES ($1, $2) RETURNING id',
      [name, passwordHash]
    )
  }

  findByName (name: string) {
    return database.oneOrNone(
      'SELECT "id", "name", "passwordHash", "createdAt", "updatedAt" FROM users WHERE name = $1',
      [name]
    )
  }
}

export const userRepository = new UserRepository()
