const jwt = require('jsonwebtoken');

const signToken = user => {
  if (process.env.NODE_ENV === 'test') {
    return '';
  }
  const token = jwt.sign(user, process.env.SECRET, { expiresIn: '7d' });
  return token;
};

module.exports = {
  signToken,
};
