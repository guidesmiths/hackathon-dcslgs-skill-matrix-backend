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
     * @return {array<Answers>} 200 - Answers response
     * @example response - 200 - success response example
     * [{"id":"asldka12311sdkasnd","email":"rachelFern@guidesmiths.com","name":"Raquel Fernandez","ecosystems":[{"id":1,"name":"React","average":3,"skills":[{"id":1,"name":"React","level":4,"sublevel":"plus","interested":false,"comments":""},{"id":2,"name":"Next.js","level":2,"sublevel":"neutral","interested":false,"comments":""}]}]},{"id":"asldka12312sdkasnd","email":"janedoe@guidesmiths.com","name":"Jane Doe","ecosystems":[{"id":1,"name":"React","average":3,"skills":[{"id":1,"name":"React","level":3,"sublevel":"neutral","interested":true,"comments":""}]},{"id":2,"name":"NodeJS","average":1,"skills":[{"id":6,"name":"Express","level":1,"sublevel":"neutral","interested":false,"comments":""}]}]},{"id":"asldka12345sdkasnd","email":"jennygo@guidesmiths.com","name":"Jenny Goijman","ecosystems":[{"id":1,"name":"React","average":1.75,"skills":[{"id":1,"name":"React","level":1,"sublevel":"neutral","interested":false,"comments":""},{"id":2,"name":"Next.js","level":1,"sublevel":"neutral","interested":false,"comments":""},{"id":3,"name":"Redux","level":3,"sublevel":"neutral","interested":false,"comments":""},{"id":4,"name":"Redux-Sagas","level":2,"sublevel":"minus","interested":false,"comments":""}]}]},{"id":"asldka12367sdkasnd","email":"danicolas@guidesmiths.com","name":"Daniel Colas","ecosystems":[{"id":1,"name":"React","average":2,"skills":[{"id":1,"name":"React","level":2,"sublevel":"neutral","interested":true,"comments":""},{"id":2,"name":"Next.js","level":1,"sublevel":"plus","interested":true,"comments":""},{"id":4,"name":"Redux-Sagas","level":3,"sublevel":"neutral","interested":true,"comments":""}]}]},{"id":"asldka12387sdkasnd","email":"ssanchez@guidesmiths.com","name":"Sofia Sanchez","ecosystems":[{"id":1,"name":"React","average":2.5,"skills":[{"id":2,"name":"Next.js","level":3,"sublevel":"minus","interested":true,"comments":""},{"id":4,"name":"Redux-Sagas","level":2,"sublevel":"neutral","interested":true,"comments":""}]}]},{"id":"asldka12389sdkasnd","email":"dyusta@guidesmiths.com","name":"David Yusta","ecosystems":[{"id":1,"name":"React","average":4,"skills":[{"id":2,"name":"Next.js","level":4,"sublevel":"plus","interested":false,"comments":""},{"id":3,"name":"Redux","level":4,"sublevel":"minus","interested":true,"comments":""}]}]},{"id":"asldkan21ansdkasnd","email":"johndoe@guidesmiths.com","name":"John Doe","ecosystems":[{"id":1,"name":"React","average":3,"skills":[{"id":1,"name":"React","level":4,"sublevel":"minus","interested":true,"comments":""},{"id":2,"name":"Next.js","level":2,"sublevel":"neutral","interested":false,"comments":""},{"id":4,"name":"Redux-Sagas","level":3,"sublevel":"plus","interested":true,"comments":""}]},{"id":2,"name":"NodeJS","average":1,"skills":[{"id":6,"name":"Express","level":1,"sublevel":"plus","interested":true,"comments":""}]}]}]
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
       * GET /api/v1/users/{id}/answers
       * @summary Get answers filtered by user id
       * @tags Answers
       * @param {number} id.params.required - User id
       * @return {Answers} 200 - Answers response
       * @example response - 200 - success response example
       * {"id":"asldkan21ansdkasnd","email":"johndoe@guidesmiths.com","name":"John Doe","ecosystems":[{"id":1,"name":"React","average":3,"skills":[{"id":1,"name":"React","level":4,"sublevel":"minus","interested":true,"comments":""},{"id":2,"name":"Next.js","level":2,"sublevel":"neutral","interested":false,"comments":""},{"id":4,"name":"Redux-Sagas","level":3,"sublevel":"plus","interested":true,"comments":""}]},{"id":2,"name":"NodeJS","average":1,"skills":[{"id":6,"name":"Express","level":1,"sublevel":"plus","interested":true,"comments":""}]}]}
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
     * @param {Answer} request.body.required - Filter by name, skill id & level
     * @return {object} 200 - Answers response
     * @example response - 200 - success response example
     * {"skill_id":3,"user_id":"asldka12312sdkasnd","skill_value":4,"created_on":"2021-07-13T12:53:04.076Z","updated_on":"2021-07-13T12:53:04.076Z","interested":true,"comments":"This is my comment","skill_subvalue":"minus"}
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
