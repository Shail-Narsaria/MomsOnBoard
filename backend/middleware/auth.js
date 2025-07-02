const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  let token = req.header('Authorization') || req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth; 