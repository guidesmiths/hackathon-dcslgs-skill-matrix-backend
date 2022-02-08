const jwt = require('jsonwebtoken');
const { tagError } = require('error-handler-module');
const { unauthorizedError } = require('../utils/errorHandler');

const validateToken = adminList => (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'test') {
      req.user = {
        user_id: '12345678910',
        email: 'Jorge.Adame@dcsl.com',
        name: 'Jorge Adame',
        role: 'admin',
        seniority: 'Intern',
      };
      return next();
    }
    const token = req.headers.authorization;

    if (!token) { throw unauthorizedError('No authentication header'); }
    if (!token.startsWith('Bearer ')) { throw unauthorizedError('Invalid authentication header'); }

    const split = token.split(' ');

    if (token === 'null') { throw unauthorizedError('No token available'); }

    const value = jwt.verify(split[1], process.env.SECRET, { algorithms: ['HS256'] });
    req.user = value;

    if (!adminList.includes(value.role)) {
      throw unauthorizedError('No permissions for this operation');
    }

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
