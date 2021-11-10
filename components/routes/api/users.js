const { handleHttpError, tagError } = require('error-handler-module');
const { badRequestError, wrongInputError, notFoundError } = require('../../utils/errorHandler');
const userMigration = require('../../../migration/index');
const { signToken } = require('../../verification/sign-token');
const { validateToken } = require('../../verification/token-verification');

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
    app.get('/api/v1/users', validateToken(),
      async (req, res, next) => {
        try {
          const users = await controller.users.fetchUsers();
          res.send(users);
        } catch (error) {
          next(tagError(notFoundError('Impossible to find results for your request')));
        }
      });

    /**
     * POST /api/v1/user
     * @route POST /api/v1/user
     * @summary Create user
     * @tags Users
     * @param {User} request.body.required - User info
     * @return {User} 200 - Suggestion response
     * [{"user_id":"asldkan21ansdkasnd","email":"johndoe@guidesmiths.com","img_url":null,"name":"John Doe","domain":null,"role":"user"}]
     * @security jwtAuth
     */
    app.post('/api/v1/user',
      async (req, res, next) => {
        try {
          let user;
          user = await controller.users.fetchUserInfo(req.body.user_id);
          const existsUser = user;
          user = await controller.users.insertUser(req.body);
          if (!existsUser) {
            userMigration(user.email).then(answers => controller.answers.migrateAnswers(user.user_id, answers));
          }
          const token = signToken(user);
          res.send(token);
        } catch (error) {
          let parsedError = error;
          if (error.name.includes('bad_request')) {
            parsedError = badRequestError('Sorry, the user is missing');
          } else if (error.name.includes('wrong_input')) {
            parsedError = wrongInputError('Sorry, the user has not user id');
          }
          next(tagError(parsedError));
        }
      });

    /**
     * GET /api/v1/user/me
     * @route GET /api/v1/user/me
     * @summary Get user by id
     * @tags Users
     * @return {User} 200 - Successful operation
     * @example response - 200 - success response example
     * [{"user_id":"asldkan21ansdkasnd","email":"johndoe@guidesmiths.com","img_url":null,"name":"John Doe","domain":null,"role":"user"}]
     * @security jwtAuth
     */
    app.get('/api/v1/user/me', validateToken(),
      async (req, res, next) => {
        try {
          const { user: payload } = req;
          if (!payload.user_id) {
            throw badRequestError();
          }
          const user = await controller.users.fetchUserInfo(payload.user_id);
          res.send(user);
        } catch (error) {
          let parsedError = error;
          if (error.name.includes('bad_request')) {
            parsedError = badRequestError('Sorry, the user id can\'t be empty');
          }
          next(tagError(parsedError));
        }
      });

    /**
     * PUT /api/v1/user/role
     * @route PUT /api/v1/user/role
     * @summary Change user role
     * @tags Users
     * @param {ChangerUserRolePayload} request.body.required
     * @security jwtAuth
     */
    app.put('/api/v1/user/role',
      async (req, res, next) => {
        try {
          const { body: payload } = req;
          if (Object.keys(payload).length !== 2) {
            throw badRequestError();
          }
          if (!('id' in payload && 'role' in payload)) {
            throw badRequestError();
          }
          const user = await controller.users.changeUserRole(payload);
          res.send(user);
        } catch (error) {
          let parsedError = error;
          if (error.name.includes('bad_request')) {
            parsedError = badRequestError('Sorry, the number of parameters is 2: \'id\' and \'role\'');
          }
          next(tagError(parsedError));
        }
      });

    app.use(handleHttpError(logger));
    return Promise.resolve();
  };
  return { start };
};
