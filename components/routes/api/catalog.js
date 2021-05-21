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

    app.post('/api/v1/skill',
      async (req, res, next) => {
        const { body: payload } = req;
        try {
          const skill = await controller.catalog.insertSkill(payload);
          res.send(skill);
        } catch (error) {
          next(tagError(error));
        }
      });

    app.delete('/api/v1/skill/:id',
      async (req, res, next) => {
        const { params } = req;
        const { id } = params;
        try {
          const skill = await controller.catalog.deleteSkill(id);
          res.send(skill);
        } catch (error) {
          next(tagError(error));
        }
      });

    app.post('/api/v1/skill/level',
      async (req, res, next) => {
        const { body: payload } = req;
        try {
          const skillLevel = await controller.catalog.insertSkillLevel(payload);
          res.send(skillLevel);
        } catch (error) {
          next(tagError(error));
        }
      });

    app.delete('/api/v1/skill/level/:id',
      async (req, res, next) => {
        const { params } = req;
        const { id } = params;
        try {
          const skillLevel = await controller.catalog.deleteSkillLevel(id);
          res.send(skillLevel);
        } catch (error) {
          next(tagError(error));
        }
      });
    app.use(handleHttpError(logger));
    return Promise.resolve();
  };
  return { start };
};
