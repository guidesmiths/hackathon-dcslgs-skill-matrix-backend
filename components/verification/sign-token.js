const jwt = require('jsonwebtoken');

const signToken = user => {
  if (process.env.NODE_ENV === 'test') {
    return '';
  }
  return jwt.sign(user, process.env.SECRET, { expiresIn: '7d' });
};

module.exports = {
  signToken,
};
