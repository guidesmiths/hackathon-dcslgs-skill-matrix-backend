module.exports = {
  logger: { transport: null },
  pg: {
    connection: {
      host: process.env.POSTGRES_HOST || 'localhost',
      ssl: false,
      sql: ['sql/queries', 'test/sql/queries', 'test/sql/scripts'],
    },
  },
};
