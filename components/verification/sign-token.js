const jwt = require('jsonwebtoken');

const signToken = user => {
  const token = jwt.sign(user, process.env.SECRET, { expiresIn: '7d' });
  return token;
};

module.exports = {
  signToken,
};
