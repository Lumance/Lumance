const jwt = require('jsonwebtoken');

const verifyAccessToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.VITE_JWT_SECRET, (err, decoded) => {
    if (err) return res.status(400).json({ message: 'Invalid token' });

    req.user = decoded;
    next();
  });
};

module.exports = {
  verifyAccessToken
};