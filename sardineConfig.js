module.exports = {
  directory: 'migrations',
  driver: 'pg',
  tableName: 'sardine_migrations',
  connection: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    database: process.env.POSTGRES_DATABASE || 'kidibox',
    user: process.env.POSTGRES_USER || 'kidibox',
    password: process.env.POSTGRES_PASSWORD || 'kidibox'
  }
}
