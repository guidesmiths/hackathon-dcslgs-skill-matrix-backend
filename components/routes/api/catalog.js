const { handleHttpError, tagError } = require('error-handler-module');

module.exports = () => {
  const start = async ({
    app, controller, logger,
  }) => {
    /**
     * GET /api/v1/skills/catalog
     * @route GET /api/v1/skills/catalog
     * @summary Get all skills catalog
     * @tags Skills
     * @return {array<SkillWithLevels>} 200 - Successful operation
     * @example response - 200 - success response example
     * [{"id":1,"name":"React","ecosystem":"React","role":"Frontend","type":"Hard","levels":[{"description":"I have a basic knowledge of the framework. Understand the framework principles and can implement solutions defined at the documentation or tutorials","level":1},{"description":"I can define complex architectures and I can provide optimised solutions","level":4},{"description":"I can analyse working solutions and propose refactors and generalization","level":3},{"description":"I can modify effectively already working solutions to include new features","level":2}]},{"id":2,"name":"Next.js","ecosystem":"React","role":"Frontend","type":"Hard","levels":[{"description":"I understand the framework principles and I can implement solutions defined at the documentation or tutorials","level":1},{"description":"I can define complex architectures and I can provide optimised solutions","level":4},{"description":"I can analyse working solutions and I can propose refactors and generalisations","level":3},{"description":"I modify effectively already working solutions to include new features","level":2}]},{"id":3,"name":"Redux","ecosystem":"React","role":"Frontend","type":"Hard","levels":[{"description":"I have a basic knowledge of the library. I understand when use redux state and when use the component state.","level":1},{"description":"I can use the library in combination of others to build complex solutions.","level":4},{"description":"I am able to keep a normalised state, using complex reducers in order to guarantee immutability and flatten/efficient structures","level":3},{"description":"I can separate concepts and I have a proper usage of actions and reducers","level":2}]},{"id":4,"name":"Redux-Sagas","ecosystem":"React","role":"Frontend","type":"Hard","levels":[{"description":"I can configure from the scratch a new project","level":2},{"description":"I can use Sagas to manage the state of all the components such ui (modals/toast) navigation (navigate between screens) and app state","level":4},{"description":"I can write both sync and async sagas processes","level":3},{"description":"I can add new sagas into a working project","level":1}]},{"id":5,"name":"Gatsby","ecosystem":"React","role":"Frontend","type":"Hard","levels":[{"description":null,"level":null}]},{"id":6,"name":"Express","ecosystem":"NodeJS","role":"Frontend","type":"Hard","levels":[{"description":null,"level":null}]}]
     * @security JWT
     */
    app.get('/api/v1/skills/catalog',
      async (req, res, next) => {
        try {
          const catalog = await controller.catalog.fetchSkillCatalog();
          res.send(catalog);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * POST /api/v1/skill
     * @summary Create a new skill or update an existing one
     * @tags Skills
     * @param {Skill} request.body.required - Skill info
     * @return {object} 200 - Skill response
     * @example response - 200 - success response example
     * {"id":6,"name":"ReactCssTransition","type":2,"ecosystem":1,"role":1,"description":"","created_on":"2021-06-06T17:14:40.458Z","updated_on":"2021-06-06T17:14:40.458Z"}
     */
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

    /**
     * DELETE /api/v1/skill/:id
     * @summary Delete a skill by id
     * @tags Skills
     * @param {number} id.required - Skill id
     */
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

    /**
     * POST /api/v1/skill/level
     * @summary Create a new skill level or update an existing one
     * @tags Skill level
     * @param {Level} request.body.required - Skill info
     * @return {object} 200 - Skill response
     * @example response - 200 - success response example
     * {"id":17,"level":1,"description":"I have a basic knowledge of the framework. I understand the framework principles and I can implement solutions defined at the documentation or tutorials","skill_id":5,"created_on":"2021-06-06T17:18:16.446Z","updated_on":"2021-06-06T17:18:16.446Z"}
     */
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

    /**
     * DELETE /api/v1/skill/level/:id
     * @summary Delete a skill level by id
     * @tags Skill level
     * @param {number} id.required - Skill level id
     */
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
