const { join } = require('path');
const System = require('systemic');
const stores = require('require-all')(join(__dirname, 'stores'));

module.exports = new System({ name: 'store' })
  .add('store.catalog', stores.catalog())
  .dependsOn('pg')
  .add('store')
  .dependsOn({
    component: 'store.catalog',
    destination: 'catalog',
  });
