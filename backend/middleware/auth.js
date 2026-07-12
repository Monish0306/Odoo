const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ data: null, error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'some-random-string-here');
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      departmentId: decoded.departmentId,
    };
    next();
  } catch (err) {
    return res.status(401).json({ data: null, error: 'Unauthorized: Invalid token' });
  }
};
