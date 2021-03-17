const { join } = require('path');
const System = require('systemic');
const controllers = require('require-all')(join(__dirname, 'controllers'));

module.exports = new System({ name: 'controller' })
  .add('controller.catalog', controllers.catalog())
  .dependsOn('logger', 'store')
  .add('controller')
  .dependsOn({
    component: 'controller.catalog',
    destination: 'catalog',
  });
