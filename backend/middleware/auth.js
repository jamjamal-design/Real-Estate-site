// Middleware to check if user is an admin
// This is a simple implementation. In production, use JWT tokens or session-based auth

const isAdmin = (req, res, next) => {
  // Check for admin token in headers
  const adminToken = req.headers['x-admin-token'];
  
  // Get admin token from environment variable
  const validAdminToken = process.env.ADMIN_TOKEN || 'admin-secret-token';
  
  if (!adminToken) {
    return res.status(401).json({ message: 'Access denied. No admin token provided.' });
  }
  
  if (adminToken !== validAdminToken) {
    return res.status(403).json({ message: 'Access denied. Invalid admin token.' });
  }
  
  // User is admin, proceed to the next middleware/route handler
  next();
};

// Variant that also accepts token in query string (useful for EventSource which can't set headers)
const isAdminAny = (req, res, next) => {
  const headerToken = req.headers['x-admin-token'];
  const queryToken = req.query.token;
  const token = headerToken || queryToken;

  const validAdminToken = process.env.ADMIN_TOKEN || 'admin-secret-token';

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No admin token provided.' });
  }

  if (token !== validAdminToken) {
    return res.status(403).json({ message: 'Access denied. Invalid admin token.' });
  }

  next();
}

module.exports = { isAdmin, isAdminAny };
