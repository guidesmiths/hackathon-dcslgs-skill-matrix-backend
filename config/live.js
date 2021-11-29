module.exports = {
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
  pg: {
    connection: {
      user: process.env.POSTGRES_USER || 'postgres',
      database: process.env.POSTGRES_DB || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: process.env.POSTGRES_PORT || 5432,
      ssl: true,
    },
  },
};
