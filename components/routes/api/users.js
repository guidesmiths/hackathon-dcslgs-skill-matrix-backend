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
     * [{"user_id":"asldkan21ansdkasnd","email":"johndoe@guidesmiths.com","img_url":null,"name":"John Doe","domain":null,"role":"user"},{"user_id":"asldka12312sdkasnd","email":"janedoe@guidesmiths.com","img_url":null,"name":"Jane Doe","domain":null,"role":"user"},{"user_id":"asldka12345sdkasnd","email":"jennygo@guidesmiths.com","img_url":null,"name":"Jenny Goijman","domain":null,"role":"user"},{"user_id":"asldka12367sdkasnd","email":"danicolas@guidesmiths.com","img_url":null,"name":"Daniel Colas","domain":null,"role":"user"},{"user_id":"asldka12389sdkasnd","email":"dyusta@guidesmiths.com","img_url":null,"name":"David Yusta","domain":null,"role":"user"},{"user_id":"asldka12387sdkasnd","email":"ssanchez@guidesmiths.com","img_url":null,"name":"Sofia Sanchez","domain":null,"role":"user"},{"user_id":"asldka12311sdkasnd","email":"rachelFern@guidesmiths.com","img_url":null,"name":"Raquel Fernandez","domain":null,"role":"user"}]
     * @security jwtAuth
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
