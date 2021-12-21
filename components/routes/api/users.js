const { handleHttpError, tagError } = require('error-handler-module');
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
          next(tagError(error));
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
          const { body } = req;
          user = await controller.users.fetchUserInfo(body.user_id);
          const existsUser = user;
          if (existsUser) {
            body.role = user.role;
          }
          user = await controller.users.insertUser(body);
          if (!existsUser) {
            await userMigration(user.email).then(answers => controller.answers.migrateAnswers(user.user_id, answers));
          }
          const token = signToken(user);
          res.send(token);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * GET /api/v1/user/me
     * @route GET /api/v1/user/me
     * @summary Get user by id
     * @tags Users
     * @return {User} 200 - Successful operation
     * @example response - 200 - success response example
     * [{"id":"asldkan21ansdkasnd","email":"johndoe@guidesmiths.com","img_url":null,"name":"John Doe","domain":null,"role":"user"}]
     * @security jwtAuth
     */
    app.get('/api/v1/user/me', validateToken(),
      async (req, res, next) => {
        try {
          const { user: payload } = req;
          const user = await controller.users.fetchUserInfo(payload.user_id);
          res.send({
            id: user.user_id,
            email: user.email,
            img_url: user.img_url,
            name: user.name,
            domain: user.domain,
            role: user.role,
            country: user.country,
          });
        } catch (error) {
          next(tagError(error));
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
          const user = await controller.users.changeUserRole(payload);
          res.send(user);
        } catch (error) {
          next(tagError(error));
        }
      });
    /**
     * PATCH /api/v1/user/country
     * @route PATCH /api/v1/user/country
     * @summary Change user country
     * @tags Users
     * @param {ChangerUserCountryPayload} request.body.required
     * @security jwtAuth
     */
    app.patch('/api/v1/user/country',
      async (req, res, next) => {
        try {
          const { body: payload } = req;
          const user = await controller.users.changeUserCountry(payload);
          res.send(user);
        } catch (error) {
          next(tagError(error));
        }
      });

    /**
     * GET /api/v1/user/skill/{skillId}
     * @route GET /ui/user/skill/{skillId}
     * @summary Get user level by skill id
     * @tags Users
     * @param {number} skillId
     * @return {object} 200 - Successful operation
     * @example response - 200 - success response example
     * @security jwtAuth
     */
    app.get('/api/v1/user/skill/:skillId', validateToken(),
      async (req, res, next) => {
        try {
          const { user: { user_id: userId }, params: { skillId } } = req;
          const level = await controller.users.fetchLevelUserSkill(skillId, userId);
          res.send(level || { skill_value: 0 });
        } catch (error) {
          next(tagError(error));
        }
      });

    app.use(handleHttpError(logger));
    return Promise.resolve();
  };
  return { start };
};
