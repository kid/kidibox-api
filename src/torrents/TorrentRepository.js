import database from '../database';

export default class TorrentRepository {
  getAll() {
    return database.query(
      'SELECT t."id", t."name", t."hashString", t."createdAt", u.name as "userName"' +
      'FROM torrents t ' +
      'LEFT OUTER JOIN users u ON u."id" = t."userId"'
    );
  }

  create(userId: number, hashString: string, name: ?string) {
    const query = 'INSERT INTO torrents ("hashString", "name", "userId") VALUES ($1, $2, $3) RETURNING id';
    return database.one(query, [hashString, name, userId]);
  }
}
