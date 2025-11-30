// middleware/role.middleware.js
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.VaiTro)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
}

module.exports = { requireRole };
