module.exports = {
  logger: { transport: null },
  pg: {
    connection: {
      host: process.env.POSTGRES_HOST || 'localhost',
      ssl: false,
      sql: ['sql/queries', 'test/sql/queries', 'test/sql/scripts'],
    },
  },
  // Testing user information
  routes: {
    admin: {
      userTest: {
        user_id: 'p1234567890',
        email: 'Jorge.Adame@dcsl.com',
        name: 'Jorge Adame',
        role: 'user',
      },
    },
  },
};
