const { handleHttpError, tagError } = require('error-handler-module');

module.exports = () => {
  const start = async ({
    app, controller, logger,
  }) => {
    /**
     * GET /api/v1/suggestions
     * @route GET /api/v1/suggestions
     * @summary Get all the suggestions
     * @tags Suggestions
     * @return {array<Suggestion>} 200 - Successful operation
     * @example response - 200 - success response example
     * [{"id":1,"description":"This is a suggestion related to the skill Next.js.","subject":"Skills","userId":"asldkan21ansdkasnd","userName":"John Doe","createdOn":"2021-07-28T08:45:30.231Z","updatedOn":"2021-07-28T08:45:30.231Z"},{"id":2,"description":"This is an other suggestion related to the skill Next.js.","subject":"Skills","userId":"asldka12312sdkasnd","userName":"Jane Doe","createdOn":"2021-07-28T08:45:30.231Z","updatedOn":"2021-07-28T08:45:30.231Z"},{"id":3,"description":"I would like to add \"Chinese\" as a new skill","subject":"Skills","userId":"asldka12345sdkasnd","userName":"Jenny Goijman","createdOn":"2021-07-28T08:45:30.231Z","updatedOn":"2021-07-28T08:45:30.231Z"},{"id":4,"description":"This is a suggestion","subject":"Others","userId":"asldka12367sdkasnd","userName":"Daniel Colas","createdOn":"2021-07-28T08:45:30.231Z","updatedOn":"2021-07-28T08:45:30.231Z"}]

     * @security JWT
     */
    app.get('/api/v1/suggestions',
      async (req, res, next) => {
        try {
          const suggestion = await controller.suggestions.fetchSuggestions();
          res.send(suggestion);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * POST /api/v1/suggestion
     * @summary Create a new suggestion or update an existing one
     * @tags Suggestions
     * @param {Suggestion} request.body.required - Suggestion info
     * @return {object} 200 - Suggestion response
     * @example response - 200 - success response example
     * {"id":5,"description":"This is a new suggestionnn.","subject":"Others","user_id":"asldka12367sdkasnd","created_on":"2021-07-28T08:46:13.618Z","updated_on":"2021-07-28T08:46:13.618Z"}
     */
    app.post('/api/v1/suggestion',
      async (req, res, next) => {
        const { body: payload } = req;
        try {
          const suggestion = await controller.suggestions.insertSuggestion(payload);
          res.send(suggestion);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
   * DELETE /api/v1/suggestion/{id}
   * @summary Delete a suggestion by id
   * @tags Suggestions
   * @param {number} id.required - Suggestion id
   */
    app.delete('/api/v1/suggestion/:id',
      async (req, res, next) => {
        const { params } = req;
        const { id } = params;
        try {
          const suggestion = await controller.suggestions.deleteSuggestion(id);
          res.send(suggestion);
        } catch (error) {
          next(tagError(error));
        }
      });

    app.use(handleHttpError(logger));
    return Promise.resolve();
  };
  return { start };
};
