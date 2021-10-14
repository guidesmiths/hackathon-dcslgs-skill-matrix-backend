const { join } = require('path');
const System = require('systemic');
const stores = require('require-all')(join(__dirname, 'stores'));

module.exports = new System({ name: 'store' })
  .add('store.ecosystems', stores.ecosystems())
  .dependsOn('pg')
  .add('store.skills', stores.skills())
  .dependsOn('pg')
  .add('store.skillLevels', stores.skillLevels())
  .dependsOn('pg')
  .add('store.users', stores.users())
  .dependsOn('pg')
  .add('store.answers', stores.answers())
  .dependsOn('pg')
  .add('store.suggestions', stores.suggestions())
  .dependsOn('pg')
  .add('store')
  .dependsOn({
    component: 'store.ecosystems',
    destination: 'ecosystems',
  }, {
    component: 'store.skills',
    destination: 'skills',
  }, {
    component: 'store.skillLevels',
    destination: 'skillLevels',
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
