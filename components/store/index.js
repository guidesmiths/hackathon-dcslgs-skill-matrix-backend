const { join } = require('path');
const System = require('systemic');
const stores = require('require-all')(join(__dirname, 'stores'));

module.exports = new System({ name: 'store' })
  .add('store.catalog', stores.catalog())
  .dependsOn('pg')
  .add('store.users', stores.users())
  .dependsOn('pg')
  .add('store.answers', stores.answers())
  .dependsOn('pg')
  .add('store.suggestions', stores.suggestions())
  .dependsOn('pg')
  .add('store')
  .dependsOn({
    component: 'store.catalog',
    destination: 'catalog',
  }, {
    component: 'store.users',
    destination: 'users',
  }, {
    component: 'store.answers',
    destination: 'answers',
  }, {
    component: 'store.suggestions',
    destination: 'suggestions',
  });
