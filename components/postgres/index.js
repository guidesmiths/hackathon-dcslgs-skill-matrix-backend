const System = require('systemic');
const initPg = require('./initPostgres');

module.exports = new System({ name: 'pg' })
  .add('pg', initPg({ configPath: 'connection' }))
  .dependsOn('config', 'logger');
