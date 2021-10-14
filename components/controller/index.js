const { join } = require('path');
const System = require('systemic');
const controllers = require('require-all')(join(__dirname, 'controllers'));

module.exports = new System({ name: 'controller' })
  .add('controller.ecosystems', controllers.ecosystems())
  .dependsOn('logger', 'store')
  .add('controller.skills', controllers.skills())
  .dependsOn('logger', 'store')
  .add('controller.skillLevels', controllers.skillLevels())
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
      component: 'controller.ecosystems',
      destination: 'ecosystems',
    }, {
      component: 'controller.skills',
      destination: 'skills',
    }, {
      component: 'controller.skillLevels',
      destination: 'skillLevels',
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
