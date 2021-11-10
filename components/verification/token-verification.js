const jwt = require('jsonwebtoken');
const { unauthorizedError, tagError } = require('../utils/errorHandler');

const validateToken = (publicKey, userTest) => (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'test') {
      req.user = userTest;
      return next();
    }
    const token = req.headers.authorization;

    if (!token) { throw unauthorizedError('No authentication header'); }
    if (!token.startsWith('Bearer ')) { throw unauthorizedError('Invalid authentication header'); }

    const split = token.split(' ');

    const value = jwt.verify(split[1], publicKey, { algorithms: ['RS256'] });
    req.user = {
      user_id: value.sub,
      email: value.preferred_username,
      name: value.name,
      role: 'user',
    };

    return next();
  } catch (error) {
    let parsedError = error;
    if (error.message.includes('jwt expired')) {
      parsedError = unauthorizedError('jwt expired');
    }
    return next(tagError(parsedError));
  }
};

module.exports = {
  validateToken,
};
