const { handleHttpError, tagError } = require('error-handler-module');

module.exports = () => {
  const start = async ({
    app, controller, logger,
  }) => {
    /**
     * GET /api/v1/users
     * @route GET /api/v1/users
     * @summary Get all users
     * @tags Users
     * @return {array<User>} 200 - Successful operation
     * @example response - 200 - success response example
     * [
     *   {
     *      "user_id": "asldkan21ansdkasnd",
     *      "email": "johndoe@guidesmiths.com",
     *      "img_url": null,
     *      "name": "John Doe",
     *      "domain": null,
     *      "role":"user"
     *   },
     *   {
     *      "user_id": "asldka12312sdkasnd",
     *      "email": "janedoe@guidesmiths.com",
     *      "img_url": null,
     *      "name": "Jane Doe",
     *      "domain": null,
     *      "role":"user"
     *   }
     * ]
     * @security JWT
     */
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
