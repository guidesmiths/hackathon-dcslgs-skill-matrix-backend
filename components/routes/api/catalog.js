const { handleHttpError, tagError } = require('error-handler-module');

module.exports = () => {
  const start = async ({
    app, controller, logger,
  }) => {
    /**
     * GET /api/v1/ecosystems
     * @route GET /api/v1/ecosystems
     * @summary Get all the skills by ecosystems
     * @tags Ecosystem
     * @return {array<SkillsByEcosystem>} 200 - Successful operation
     * @example response - 200 - success response example
     * [{"id":1,"name":"React","skills":[{"id":1,"name":"React","type":{"id":2,"name":"Hard"},"role":{"id":1,"name":"Frontend"},"description":"","levels":[{"level":1,"levelDescription":"I have a basic knowledge of the framework. Understand the framework principles and can implement solutions defined at the documentation or tutorials"},{"level":2,"levelDescription":"I can modify effectively already working solutions to include new features"},{"level":3,"levelDescription":"I can analyse working solutions and propose refactors and generalization"},{"level":4,"levelDescription":"I can define complex architectures and I can provide optimised solutions"}]},{"id":2,"name":"Next.js","type":{"id":2,"name":"Hard"},"role":{"id":1,"name":"Frontend"},"description":"","levels":[{"level":1,"levelDescription":"I understand the framework principles and I can implement solutions defined at the documentation or tutorials"},{"level":2,"levelDescription":"I modify effectively already working solutions to include new features"},{"level":3,"levelDescription":"I can analyse working solutions and I can propose refactors and generalisations"},{"level":4,"levelDescription":"I can define complex architectures and I can provide optimised solutions"}]},{"id":3,"name":"Redux","type":{"id":2,"name":"Hard"},"role":{"id":1,"name":"Frontend"},"description":"","levels":[{"level":1,"levelDescription":"I have a basic knowledge of the library. I understand when use redux state and when use the component state."},{"level":2,"levelDescription":"I can separate concepts and I have a proper usage of actions and reducers"},{"level":3,"levelDescription":"I am able to keep a normalised state, using complex reducers in order to guarantee immutability and flatten/efficient structures"},{"level":4,"levelDescription":"I can use the library in combination of others to build complex solutions."}]},{"id":4,"name":"Redux-Sagas","type":{"id":2,"name":"Hard"},"role":{"id":1,"name":"Frontend"},"description":"","levels":[{"level":1,"levelDescription":"I can add new sagas into a working project"},{"level":2,"levelDescription":"I can configure from the scratch a new project"},{"level":3,"levelDescription":"I can write both sync and async sagas processes"},{"level":4,"levelDescription":"I can use Sagas to manage the state of all the components such ui (modals/toast) navigation (navigate between screens) and app state"}]},{"id":5,"name":"Gatsby","type":{"id":2,"name":"Hard"},"role":{"id":1,"name":"Frontend"},"description":"","levels":[{"level":null,"levelDescription":null}]}]},{"id":2,"name":"NodeJS","skills":[{"id":6,"name":"Express","type":{"id":2,"name":"Hard"},"role":{"id":1,"name":"Frontend"},"description":"","levels":[{"level":null,"levelDescription":null}]}]}]

     * @security JWT
     */
    app.get('/api/v1/ecosystems',
      async (req, res, next) => {
        try {
          const catalog = await controller.catalog.fetchEcosystems();
          res.send(catalog);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * POST /api/v1/ecosystem
     * @summary Create a new ecosystem
     * @tags Ecosystem
     * @param {Ecosystem} request.body.required - Ecosystem info //should be Ecosystem without skills
     * @return {object} 200 - Ecosystem response
     * @example response - 200 - success response example
     * {
        name: 'Testingg',
        skills: [
          {
            name: 'Cypress',
            type: 1,
            role: 1,
            description: '',
            levels: [
              { level: 1, description: 'I work effectively modifying existing solutions implemented with it.' },
              { level: 2, description: 'I can develop new solutions that use it. I am able to implement a not so basic text suite with its related fixtures.' },
              { level: 3, description: 'I can design new solutions that use it, in order to optimize response time, processing cost, managing a huge amount test specs. I can handle the cy-data anchors in an efficient way. I can implement custom commands.' },
              { level: 4, description: 'I deeply understand the library in order to get the most out of it. I understand the API integration that cypress provides and I am able to work with it in CI/CD process' },
            ],
          },
        ],
      }
     */
    app.post('/api/v1/ecosystem',
      async (req, res, next) => {
        const { body: payload } = req;
        try {
          const ecosystem = await controller.catalog.insertEcosystem(payload);
          res.send(ecosystem);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * PUT /api/v1/ecosystem/{id}
     * @summary Update an existing ecosystem name
     * @tags Ecosystem
     * @param {number} id.required - Ecosystem id
     * @param {string} request.body.required - Ecosystem name
     * @return {object} 200 - Ecosystem response
     * @example response - 200 - success response example
     * {"name":"Testing"}
     */
    app.put('/api/v1/ecosystem/:id',
      async (req, res, next) => {
        const { body: payload, params } = req;
        const { id } = params;
        try {
          const ecosystem = await controller.catalog.updateEcosystem(id, payload);
          res.send(ecosystem);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
   * DELETE /api/v1/ecosystem/{id}
   * @summary Delete a ecosystem by id
   * @tags Ecosystem
   * @param {number} id.required - Ecosystem id
   */
    app.delete('/api/v1/ecosystem/:id',
      async (req, res, next) => {
        const { params } = req;
        const { id } = params;
        try {
          const ecosystem = await controller.catalog.deleteEcosystem(id);
          res.send(ecosystem);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * GET /api/v1/skills
     * @route GET /api/v1/skills
     * @summary Get all the skills
     * @tags Skills
     * @return {array<Skill>} 200 - Successful operation
     * @example response - 200 - success response example
     * [{"id":1,"name":"React"},{"id":2,"name":"Next.js"},{"id":3,"name":"Redux"},{"id":4,"name":"Redux-Sagas"},{"id":5,"name":"Gatsby"},{"id":6,"name":"Express"}]

     * @security JWT
     */
    app.get('/api/v1/skills',
      async (req, res, next) => {
        try {
          const skills = await controller.catalog.fetchSkills();
          res.send(skills);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * POST /api/v1/skill
     * @summary Create a new skill
     * @tags Skills
     * @param {Skill} request.body.required - Skill info
     * @return {object} 200 - Skill response
     * @example response - 200 - success response example
     * {"name":"ReactCssTransition","type":2,"ecosystem":1,"role":1,"description":"","created_on":"2021-06-06T17:14:40.458Z","updated_on":"2021-06-06T17:14:40.458Z"}
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
     * PUT /api/v1/skill/{id}
     * @summary Update an existing one
     * @tags Skills
     * @param {number} id.required - Skill id
     * @param {Skill} request.body.required - Skill info
     * @return {object} 200 - Skill response
     * @example response - 200 - success response example
     * {"name":"ReactCssTransition","type":2,"ecosystem":1,"role":1,"description":"","created_on":"2021-06-06T17:14:40.458Z","updated_on":"2021-06-06T17:14:40.458Z"}
     */

    app.put('/api/v1/skill/:id',
      async (req, res, next) => {
        const { body: payload, params } = req;
        const { id } = params;
        try {
          const skill = await controller.catalog.updateSkill(id, payload);
          res.send(skill);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * DELETE /api/v1/skill/{id}
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
     * @summary Create a new skill level
     * @tags Skill level
     * @param {Level} request.body.required - Skill info
     * @return {object} 200 - Skill response
     * @example response - 200 - success response example
     * {"level":1,"description":"I have a basic knowledge of the framework. I understand the framework principles and I can implement solutions defined at the documentation or tutorials","skill_id":5,"created_on":"2021-06-06T17:18:16.446Z","updated_on":"2021-06-06T17:18:16.446Z"}
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
     * PUT /api/v1/skill/level/{id}
     * @summary Update an existing one
     * @tags Skill level
     * @param {number} id.required - Skill level id
     * @param {Level} request.body.required - Skill info
     * @return {object} 200 - Skill response
     * @example response - 200 - success response example
     * {"level":1,"description":"I have a basic knowledge of the framework. I understand the framework principles and I can implement solutions defined at the documentation or tutorials","skill_id":5,"created_on":"2021-06-06T17:18:16.446Z","updated_on":"2021-06-06T17:18:16.446Z"}
     */
    app.put('/api/v1/skill/level/:id',
      async (req, res, next) => {
        const { body: payload, params } = req;
        const { id } = params;
        try {
          const skillLevel = await controller.catalog.updateSkillLevel(id, payload);
          res.send(skillLevel);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * DELETE /api/v1/skill/level/{id}
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
