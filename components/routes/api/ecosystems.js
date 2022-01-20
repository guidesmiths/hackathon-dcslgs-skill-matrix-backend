const { handleHttpError, tagError } = require('error-handler-module');
const { validateToken } = require('../../verification/token-verification');

module.exports = () => {
  const start = async ({
    app, controller, logger,
  }) => {
    /**
     * GET /api/v1/ecosystems
     * @route GET /api/v1/ecosystems
     * @summary Get the list of ecosystems sorted from A-Z
     * @tags Ecosystem
     * @return {array<EcosystemResponse>} 200 - Successful operation
     * @example response - 200 - success response example
     * [{"id":2,"name":"NodeJS"},{"id":1,"name":"React"}]

     * @security jwtAuth
     */
    app.get('/api/v1/ecosystems',
      async (_, res, next) => {
        try {
          const ecosystems = await controller.ecosystems.fetchEcosystems();
          res.send(ecosystems);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * GET /api/v1/ecosystem/{id}
     * @route GET /api/v1/ecosystem/{id}
     * @summary Get all the skills by ecosystems
     * @tags Ecosystem
     * @param {number} id.params.required - Ecosystem id
     * @return {array<EcosystemResponse>} 200 - Successful operation
     * @example response - 200 - success response example
     * [{"id":1,"name":"React","skills":[{"id":1,"name":"React","type":{"id":2,"name":"Hard"},"roles":[{"id":1,"name":"Frontend"},{"id":3,"name":"Fullstack"}],"description":"","levels":[{"level":1,"levelDescription":"I have a basic knowledge of the framework. Understand the framework principles and can implement solutions defined at the documentation or tutorials"},{"level":2,"levelDescription":"I can modify effectively already working solutions to include new features"},{"level":3,"levelDescription":"I can analyse working solutions and propose refactors and generalization"},{"level":4,"levelDescription":"I can define complex architectures and I can provide optimised solutions"}]},{"id":2,"name":"Next.js","type":{"id":2,"name":"Hard"},"roles":[{"id":1,"name":"Frontend"},{"id":3,"name":"Fullstack"}],"description":"","levels":[{"level":1,"levelDescription":"I understand the framework principles and I can implement solutions defined at the documentation or tutorials"},{"level":2,"levelDescription":"I modify effectively already working solutions to include new features"},{"level":3,"levelDescription":"I can analyse working solutions and I can propose refactors and generalisations"},{"level":4,"levelDescription":"I can define complex architectures and I can provide optimised solutions"}]},{"id":3,"name":"Redux","type":{"id":2,"name":"Hard"},"roles":[{"id":1,"name":"Frontend"},{"id":3,"name":"Fullstack"}],"description":"","levels":[{"level":1,"levelDescription":"I have a basic knowledge of the library. I understand when use redux state and when use the component state."},{"level":2,"levelDescription":"I can separate concepts and I have a proper usage of actions and reducers"},{"level":3,"levelDescription":"I am able to keep a normalised state, using complex reducers in order to guarantee immutability and flatten/efficient structures"},{"level":4,"levelDescription":"I can use the library in combination of others to build complex solutions."}]},{"id":4,"name":"Redux-Sagas","type":{"id":2,"name":"Hard"},"roles":[{"id":1,"name":"Frontend"},{"id":3,"name":"Fullstack"}],"description":"","levels":[{"level":1,"levelDescription":"I can add new sagas into a working project"},{"level":2,"levelDescription":"I can configure from the scratch a new project"},{"level":3,"levelDescription":"I can write both sync and async sagas processes"},{"level":4,"levelDescription":"I can use Sagas to manage the state of all the components such ui (modals/toast) navigation (navigate between screens) and app state"}]},{"id":5,"name":"Gatsby","type":{"id":2,"name":"Hard"},"roles":[{"id":1,"name":"Frontend"},{"id":3,"name":"Fullstack"}],"description":"","levels":[{"level":null,"levelDescription":null}]}]}]

     * @security jwtAuth
     */
    app.get('/api/v1/ecosystem/:id',
      async (req, res, next) => {
        const { params: { id } } = req;

        try {
          const ecosystems = await controller.ecosystems.fetchSkillsByEcosystemId(id);
          res.send(ecosystems);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * POST /api/v1/ecosystem
     * @route POST /api/v1/ecosystem
     * @summary Create a new ecosystem
     * @tags Ecosystem
     * @param {EcosystemRequest} request.body.required - Ecosystem + Skill + Levels
     * @return {object} 200 - Ecosystem response
     * @example response - 200 - success response example
     * {"id":3,"name":"Testingg","skills":[{"id":7,"name":"Cypress","type":{"id":1,"name":"Soft"},"roles":[{"id":null,"name":null}],"description":"","levels":[{"level":1,"levelDescription":"I work effectively modifying existing solutions implemented with it."},{"level":2,"levelDescription":"I can develop new solutions that use it. I am able to implement a not so basic text suite with its related fixtures."},{"level":3,"levelDescription":"I can design new solutions that use it, in order to optimize response time, processing cost, managing a huge amount test specs. I can handle the cy-data anchors in an efficient way. I can implement custom commands."},{"level":4,"levelDescription":"I deeply understand the library in order to get the most out of it. I understand the API integration that cypress provides and I am able to work with it in CI/CD process"}]}]}

    * @security jwtAuth
    */
    app.post('/api/v1/ecosystem',
      async (req, res, next) => {
        const { body: payload } = req;

        try {
          const ecosystem = await controller.ecosystems.upsertEcosystem(payload);
          res.send(ecosystem);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * DELETE /api/v1/ecosystem/{id}
     * @route DELETE /api/v1/ecosystem/{id}
     * @summary Delete a ecosystem by id
     * @tags Ecosystem
     * @param {number} id.required - Ecosystem id

     * @security jwtAuth
     */
    app.delete('/api/v1/ecosystem/:id', validateToken(),
      async (req, res, next) => {
        const { params: { id } } = req;

        try {
          const ecosystem = await controller.ecosystems.deleteEcosystem(id);
          res.send(ecosystem);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * GET /api/v1/ecosystem
     * @route GET /api/v1/ecosystem
     * @summary Filter ecosystems by name
     * @tags Ecosystem
     * @param {string} name.required - Ecosystem name
     * @return {array<EcosystemResponse>} 200 - Successful operation
     * @security jwtAuth
  */
    app.get('/api/v1/ecosystem', validateToken(),
      async (req, res, next) => {
        const { query: { name } } = req;
        try {
          const ecosystems = await controller.ecosystems.fetchEcosystemsFiltered(name);
          res.send(ecosystems);
        } catch (error) {
          next(tagError(error));
        }
      });

    app.use(handleHttpError(logger));
    return Promise.resolve();
  };
  return { start };
};
