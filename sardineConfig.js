module.exports = {
  directory: 'migrations',
  driver: 'pg',
  tableName: 'sardine_migrations',
  connection: process.env.DATABASE_URL
}
