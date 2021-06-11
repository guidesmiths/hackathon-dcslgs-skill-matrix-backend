const { handleHttpError, tagError } = require('error-handler-module');

module.exports = () => {
  const start = async ({
    app, controller, logger,
  }) => {
    /**
     * POST /api/v1/answers
     * @summary Get user answers filtered by name, skill and level
     * @tags Answers
     * @param {object} request.body.required - Filter by name, skill id & level
     * @return {array<FilteredAnswers>} 200 - Answers response
     * @example response - 200 - success response example
     * [{"id":"asldkan21ansdkasnd","email":"johndoe@guidesmiths.com","name":"John Doe","ecosystems":[{"id":1,"name":"React","skills":[{"id":1,"name":"React","level":4},{"id":4,"name":"Redux-Sagas","level":3},{"id":2,"name":"Next.js","level":2}],"average":3},{"id":2,"name":"NodeJS","skills":[{"id":6,"name":"Express","level":1}],"average":1}]},{"id":"asldka12312sdkasnd","email":"janedoe@guidesmiths.com","name":"Jane Doe","ecosystems":[{"id":1,"name":"React","skills":[{"id":1,"name":"React","level":3}],"average":3},{"id":2,"name":"NodeJS","skills":[{"id":6,"name":"Express","level":1}],"average":1}]}]
    */
    app.post('/api/v1/answers',
      async (req, res, next) => {
        const { body: filters } = req;
        try {
          const answers = await controller.answers.fetchAnswers(filters);
          res.send(answers);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
       * GET /api/v1/users/:id/answers
       * @summary Get answers filtered by user id
       * @tags Answers
       * @param {number} id.params.required - User id
       * @return {FilteredAnswers} 200 - Answers response
       * @example response - 200 - success response example
       * {"id":"asldkan21ansdkasnd","email":"johndoe@guidesmiths.com","name":"John Doe","ecosystems":[{"id":1,"name":"React","skills":[{"id":1,"name":"React","level":4},{"id":2,"name":"Next.js","level":2},{"id":4,"name":"Redux-Sagas","level":3}],"average":3},{"id":2,"name":"NodeJS","skills":[{"id":6,"name":"Express","level":1}],"average":1}]}
     */
    app.get('/api/v1/users/:id/answers',
      async (req, res, next) => {
        const { params } = req;
        const { id } = params;
        try {
          const answers = await controller.answers.fetchAnswersByUser(id);
          res.send(answers);
        } catch (error) {
          next(tagError(error));
        }
      });
    /**
     * POST /api/v1/answer
     * @summary Create a new answer or update an existing one
     * @tags Answers
     * @param {UserAnswer} request.body.required - Filter by name, skill id & level
     * @return {object} 200 - Answers response
     * @example response - 200 - success response example
     * {"skill_id":3,"user_id":"asldka12312sdkasnd","skill_value":4,"created_on":"2021-06-06T17:12:34.669Z","updated_on":"2021-06-06T17:12:34.669Z"}
     */
    app.post('/api/v1/answer',
      async (req, res, next) => {
        const { body: payload } = req;
        try {
          const answer = await controller.answers.insertAnswer(payload);
          res.send(answer);
        } catch (error) {
          next(tagError(error));
        }
      });

    app.use(handleHttpError(logger));
    return Promise.resolve();
  };
  return { start };
};
