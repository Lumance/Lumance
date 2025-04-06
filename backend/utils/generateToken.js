const jwt = require('jsonwebtoken');

const generateToken = (user, expiresIn) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn });
};

module.exports = {
  generateToken
};