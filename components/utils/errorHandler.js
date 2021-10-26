const { errorFactory, CustomErrorTypes } = require('error-handler-module');

module.exports = {
  badRequestError: error => errorFactory(CustomErrorTypes.BAD_REQUEST)(error),
  forbiddenError: error => errorFactory(CustomErrorTypes.FORBIDDEN)(error),
  wrongInputError: error => errorFactory(CustomErrorTypes.WRONG_INPUT)(error),
  notFoundError: error => errorFactory(CustomErrorTypes.NOT_FOUND)(error),
  unauthorizedError: error => errorFactory(CustomErrorTypes.UNAUTHORIZED)(error),
};
