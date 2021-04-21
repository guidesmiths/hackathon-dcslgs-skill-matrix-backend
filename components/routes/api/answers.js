const { handleHttpError, tagError } = require('error-handler-module');

module.exports = () => {
  const start = async ({
    app, controller, logger,
  }) => {
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
