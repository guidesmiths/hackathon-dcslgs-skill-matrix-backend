const Systemic = require('systemic');
const initPg = require('./initPostgres');

module.exports = new Systemic({ name: 'pg' })
  .add('pg', initPg({ configPath: 'connection' }))
  .dependsOn('config', 'logger');
