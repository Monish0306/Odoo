module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ data: null, error: 'Unauthorized: User not authenticated' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ data: null, error: 'Forbidden: Access denied' });
    }
    next();
  };
};
