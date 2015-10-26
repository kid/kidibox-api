import database from '../database';

export default class UserRepository {
  create(user) {
    return database.one(
      'INSERT INTO users ("name", "passwordHash") VALUES ($1, $2) RETURNING id',
      [user.name, user.passwordHash]
    );
  }

  findByName(name: string) {
    return database.oneOrNone(
      'SELECT "id", "name", "passwordHash", "createdAt", "updatedAt" FROM users WHERE name = $1',
      [name]
    );
  }
}
