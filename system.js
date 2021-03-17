const System = require('systemic');
const { join } = require('path');

module.exports = () => new System({ name: 'skill-matrix' })
  .bootstrap(join(__dirname, 'components'));
