require('dotenv').config();

module.exports = {
  routes: {
    admin: {
      swaggerOptions: {
        info: {
          description: 'Documentation for Skill-Matrix',
          title: 'Skill-Matrix API',
          version: '1.0.0',
          contact: {
            name: '',
            email: '',
          },
        },
        security: {
          jwtAuth: {
            type: 'http',
            scheme: 'bearer',
          },
        },
        servers: [],
        baseDir: process.cwd(),
        swaggerUIPath: '/docs/api',
        filesPattern: [
          './components/routes/**-routes.js',
          './components/routes/schema/*.js',
          './components/routes/api/*.js',
        ],
      },
      generatedDocs: [
        {
          path: '/docs/jsdoc',
          srcFolder: 'jsdoc',
        },
      ],
      publicKey: process.env.PUBLIC_KEY,
    },
  },
  server: {
    host: '0.0.0.0',
    port: 4000,
  },
  pg: {
    connection: {
      user: process.env.POSTGRES_USER || 'postgres',
      database: process.env.POSTGRES_DB || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: process.env.POSTGRES_PORT || 5432,
      max: 10,
      migrations: [{
        directory: 'sql/migrations',
        filter: '\\.sql$',
      }],
      idleTimeoutMillis: 30000,
      sql: 'sql/queries',
      ssl: false,
    },
    schema: 'skills',
  },
  logger: {
    transport: 'console',
    include: [
      'tracer',
      'timestamp',
      'level',
      'message',
      'error.message',
      'error.code',
      'error.stack',
      'request.url',
      'request.headers',
      'request.params',
      'request.method',
      'response.statusCode',
      'response.headers',
      'response.time',
      'process',
      'system',
      'package.name',
      'service',
    ],
    exclude: ['password', 'secret', 'token', 'request.headers.cookie', 'dependencies', 'devDependencies'],
  },
};
