const { handleHttpError, tagError } = require('error-handler-module');
const { validateToken } = require('../../verification/token-verification');

module.exports = () => {
  const start = async ({
    app, controller, logger,
  }) => {
    /**
     * GET /api/v1/skills
     * @route GET /api/v1/skills
     * @summary Get all the skills
     * @tags Skills
     * @return {array<SkillResponse>} 200 - Successful operation
     * @example response - 200 - success response example
     * [{"skillId":1,"skillName":"React", "ecosystemName":"React"},{"skillId":2,"skillName":"Next.js", "ecosystemName":"React"},{"skillId":3,"skillName":"Redux", "ecosystemName":"React"},{"skillId":4,"skillName":"Redux-Sagas", "ecosystemName":"React"},{"skillId":5,"skillName":"Gatsby", "ecosystemName":"React"},{"skillId":6,"skillName":"Express", "ecosystemName":"React"}]

     * @security jwtAuth
     */
    app.get('/api/v1/skills',
      validateToken(['user', 'admin']),
      async (req, res, next) => {
        try {
          const skills = await controller.skills.fetchSkills();
          res.send(skills);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * POST /api/v1/skill
     * @route POST /api/v1/skill
     * @summary Create a new skill
     * @tags Skills
     * @param {SkillRequest} request.body.required - Skill info
     * @return {object} 200 - Skill response
     * @example response - 200 - success response example
     * {"id":7,"name":"ReactCssTransition","type":2,"ecosystem":1,"roles":[1],"description":"","created_on":"2021-08-20T21:03:15.504Z","updated_on":"2021-08-20T21:03:15.504Z"}

     * @security jwtAuth
     */

    app.post('/api/v1/skill',
      validateToken(['admin']),
      async (req, res, next) => {
        const { body: payload } = req;

        try {
          const skill = await controller.skills.upsertSkill(payload);
          res.send(skill);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * PUT /api/v1/skill/{id}
     * @route PUT /api/v1/skill/{id}
     * @summary Update an existing skill
     * @tags Skills
     * @param {number} id.required - Skill id
     * @param {SkillRequest} request.body.required - Skill info
     * @return {object} 200 - Skill response
     * @example response - 200 - success response example
     * {"id":2,"name":"NodeJS","type":2,"ecosystem":1,"roles":[1],"description":"New description","created_on":"2021-08-20T21:02:34.123Z","updated_on":"2021-08-20T21:02:34.123Z"}

    * @security jwtAuth
    */

    app.put('/api/v1/skill/:id',
      validateToken(['admin']),
      async (req, res, next) => {
        const { body: payload, params: { id } } = req;

        try {
          const skill = await controller.skills.updateSkill(id, payload);
          res.send(skill);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * DELETE /api/v1/skill/{id}
     * @route DELETE /api/v1/skill/{id}
     * @summary Delete a skill by id
     * @tags Skills
     * @param {number} id.required - Skill id

    * @security jwtAuth
    */
    app.delete('/api/v1/skill/:id',
      validateToken(['admin']),
      async (req, res, next) => {
        const { params: { id } } = req;

        try {
          const skill = await controller.skills.deleteSkill(id);
          res.send(skill);
        } catch (error) {
          next(tagError(error));
        }
      });

    app.use(handleHttpError(logger));
    return Promise.resolve();
  };
  return { start };
};
