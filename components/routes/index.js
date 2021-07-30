const { join } = require('path');
const System = require('systemic');
const apiRoutes = require('require-all')(join(__dirname, 'api'));
const adminRoutes = require('./admin-routes');

module.exports = new System({ name: 'routes' })
  .add('routes.admin', adminRoutes())
  .dependsOn('config', 'logger', 'app', 'middleware.prepper', 'manifest')
  .add('routes.catalog', apiRoutes.catalog())
  .dependsOn('logger', 'app', 'controller')
  .add('routes.users', apiRoutes.users())
  .dependsOn('logger', 'app', 'controller')
  .add('routes.answers', apiRoutes.answers())
  .dependsOn('logger', 'app', 'controller')
  .add('routes.suggestions', apiRoutes.suggestions())
  .dependsOn('logger', 'app', 'controller')
  .add('routes')
  .dependsOn('routes.admin', 'routes.catalog', 'routes.users', 'routes.answers', 'routes.suggestions');
