const { handleHttpError, tagError } = require('error-handler-module');

module.exports = () => {
  const start = async ({
    app, controller, logger,
  }) => {
    app.get('/api/v1/skills/catalog',
      async (req, res, next) => {
        try {
          const catalog = await controller.catalog.fetchSkillCatalog();
          res.send(catalog);
        } catch (error) {
          next(tagError(error));
        }
      });
    app.use(handleHttpError(logger));
    return Promise.resolve();
  };
  return { start };
};
