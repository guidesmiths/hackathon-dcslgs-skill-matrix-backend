module.exports = {
  logger: { transport: null },
  pg: {
    connection: {
      host: 'localhost',
      user: 'postgres',
      database: 'postgres',
      password: 'password',
      ssl: false,
      sql: ['sql/queries', 'test/sql/queries', 'test/sql/scripts'],
    },
  },
};
