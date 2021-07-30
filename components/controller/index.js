const { join } = require('path');
const System = require('systemic');
const controllers = require('require-all')(join(__dirname, 'controllers'));

module.exports = new System({ name: 'controller' })
  .add('controller.catalog', controllers.catalog())
  .dependsOn('logger', 'store')
  .add('controller.users', controllers.users())
  .dependsOn('logger', 'store')
  .add('controller.answers', controllers.answers())
  .dependsOn('logger', 'store')
  .add('controller.suggestions', controllers.suggestions())
  .dependsOn('logger', 'store')
  .add('controller')
  .dependsOn(
    {
      component: 'controller.catalog',
      destination: 'catalog',
    }, {
      component: 'controller.users',
      destination: 'users',
    }, {
      component: 'controller.answers',
      destination: 'answers',
    }, {
      component: 'controller.suggestions',
      destination: 'suggestions',
    },

  );
