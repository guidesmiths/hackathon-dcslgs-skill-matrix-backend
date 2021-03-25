const { handleHttpError, tagError } = require('error-handler-module');

module.exports = () => {
  const start = async ({
    app, controller, logger,
  }) => {
    app.get('/api/v1/users',
      async (req, res, next) => {
        try {
          const users = await controller.users.fetchUsers();
          res.send(users);
        } catch (error) {
          next(tagError(error));
        }
      });
    app.use(handleHttpError(logger));
    return Promise.resolve();
  };
  return { start };
};
