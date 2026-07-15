// Requires the logged-in user to have the 'admin' role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied: admin role required' });
  }
  next();
};

// Requires the logged-in user to have the 'user' or 'admin' role (i.e. any authenticated account)
const requireUser = (req, res, next) => {
  if (!req.user || !['user', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Access denied: user role required' });
  }
  next();
};

module.exports = { requireAdmin, requireUser };
