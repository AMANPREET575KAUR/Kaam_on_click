const jwt = require('jsonwebtoken');

function adminAuth(req, res, next) {
  const token = req.headers['admin-token'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = adminAuth;