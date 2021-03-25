const { handleHttpError, tagError } = require('error-handler-module');

module.exports = () => {
  const start = async ({
    app, controller, logger,
  }) => {
    app.get('/api/v1/answers',
      async (req, res, next) => {
        try {
          const answers = await controller.answers.fetchAnswers();
          res.send(answers);
        } catch (error) {
          next(tagError(error));
        }
      });
    app.use(handleHttpError(logger));
    return Promise.resolve();
  };
  return { start };
};
