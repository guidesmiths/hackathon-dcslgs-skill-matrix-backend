const { handleHttpError, tagError } = require('error-handler-module');
const userMigration = require('../../../migration/index');
const { signToken } = require('../../verification/sign-token');
const { validateToken } = require('../../verification/token-verification');
const { callMsGraph } = require('../../verification/authConfig');

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
      validateToken(['user', 'admin']),
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
          const { body } = req;
          // Avoid MS login in testing environment
          if (process.env.NODE_ENV === 'test') {
            const user = {
              user_id: '12345678910',
              email: 'Jorge.Adame@dcsl.com',
              name: 'Jorge Adame',
              role: 'user',
              seniority: 'Intern',
            };
            res.send(await controller.users.insertUser(user));
          } else {
            const response = await callMsGraph(Object.values(body)[0]);
            const {
              id,
              mail: email,
              displayName: name,
              jobTitle: seniority,
              country,
            } = response;

            const user = {
              user_id: id,
              email: email.toLowerCase(),
              name,
              seniority,
              country: country?.trim(),
            };
            // First we check if the user already exists
            let existingUser;
            existingUser = await controller.users.fetchUserInfo(id);
            const existsUser = existingUser;
            // If exists, the role won't change
            if (existsUser) {
              user.role = existingUser.role;
            } else {
              // Otherwise, we need to check if the user is an admin
              const isAdmin = await controller.users.checkIsAdmin(user.email);
              if (isAdmin) {
                user.role = 'admin';
              }
            }
            // The user is upserted
            existingUser = await controller.users.insertUser(user);
            if (!existsUser) {
              await userMigration(user.email)
                .then(answers => {
                  if (answers) {
                    controller.answers.migrateAnswers(id, answers);
                  }
                })
                .catch(error => next(tagError(error)));
            }
            // Finally we sign the token
            const signedToken = signToken({ user_id: id, role: user.role || 'user' });
            res.send(signedToken);
          }
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
    app.get('/api/v1/user/me',
      validateToken(['user', 'admin']),
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
     * @param {ChangeUserRolePayload} request.body.required
     * @security jwtAuth
     */
    app.put('/api/v1/user/role',
      validateToken(['admin']),
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
     * @param {ChangeUserCountryPayload} request.body.required
     * @security jwtAuth
     */
    app.patch('/api/v1/user/country',
      validateToken(['user', 'admin']),
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
    app.get('/api/v1/user/skill/:skillId',
      validateToken(['user', 'admin']),
      async (req, res, next) => {
        try {
          const { user: { user_id: userId }, params: { skillId } } = req;
          const level = await controller.users.fetchLevelUserBySkill(skillId, userId);
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
