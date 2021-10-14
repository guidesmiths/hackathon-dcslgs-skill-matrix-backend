const { handleHttpError, tagError } = require('error-handler-module');

module.exports = () => {
  const start = async ({
    app, controller, logger,
  }) => {
    /**
     * POST /api/v1/skill/level
     * @route POST /api/v1/skill/level
     * @summary Create a new skill level
     * @tags Skill level
     * @param {LevelRequest} request.body.required - Skill info
     * @return {object} 200 - Skill response
     * @example response - 200 - success response example
     * {"id":17,"level":1,"description":"I have a basic knowledge of the framework. I understand the framework principles and I can implement solutions defined at the documentation or tutorials","skill_id":5,"created_on":"2021-08-20T20:53:44.352Z","updated_on":"2021-08-20T20:53:44.352Z"}

     * @security jwtAuth
     */
    app.post('/api/v1/skill/level',
      async (req, res, next) => {
        const { body: payload } = req;
        try {
          const skillLevel = await controller.skillLevels.insertSkillLevel(payload);
          res.send(skillLevel);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * PUT /api/v1/skill/level/{id}
     * @route PUT /api/v1/skill/level/{id}
     * @summary Update an existing level
     * @tags Skill level
     * @param {number} id.required - Skill level id
     * @param {LevelRequest} request.body.required - Skill info
     * @return {object} 200 - Skill response
     * @example response - 200 - success response example
     * {"id":5,"level":1,"description":"I understand the framework principles and I can implement solutions defined at the documentation or tutorials.","skill_id":5,"created_on":"2021-08-20T20:54:24.735Z","updated_on":"2021-08-20T20:54:24.735Z"}

     * @security jwtAuth
     */
    app.put('/api/v1/skill/level/:id',
      async (req, res, next) => {
        const { body: payload, params } = req;
        const { id } = params;
        try {
          const skillLevel = await controller.skillLevels.updateSkillLevel(id, payload);
          res.send(skillLevel);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * DELETE /api/v1/skill/level/{id}
     * @route DELETE /api/v1/skill/level/{id}
     * @summary Delete a skill level by id
     * @tags Skill level
     * @param {number} id.required - Skill level id

     * @security jwtAuth
     */
    app.delete('/api/v1/skill/level/:id',
      async (req, res, next) => {
        const { params } = req;
        const { id } = params;
        try {
          const skillLevel = await controller.skillLevels.deleteSkillLevel(id);
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
