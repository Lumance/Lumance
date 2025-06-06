import jwt from 'jsonwebtoken';

const generateToken = (userId, expiresIn) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
};

const verifyAccessToken = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Access denied. Unauthorized.' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;

    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid Token' });
  }
};

export { generateToken, verifyAccessToken };