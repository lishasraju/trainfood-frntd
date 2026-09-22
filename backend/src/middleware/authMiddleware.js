import { verifyToken, db } from '../config/database.js';

/**
 * Middleware to authenticate requests using Bearer JWT token
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in to proceed.'
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Session token is invalid or has expired. Please log in again.'
    });
  }

  const user = db.findUserById(decoded.id);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'User account associated with this session was not found.'
    });
  }

  const { salt, password_hash, ...safeUser } = user;
  req.user = safeUser;
  next();
}

/**
 * Optional authentication: attaches user if token is present, but doesn't fail if absent
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : null;

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      const user = db.findUserById(decoded.id);
      if (user) {
        const { salt, password_hash, ...safeUser } = user;
        req.user = safeUser;
      }
    }
  }
  next();
}

/**
 * Middleware to require Admin / Pantry Manager role
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in as Station Admin.'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: This action requires Station Pantry Admin or IRCTC Supervisor privileges.'
    });
  }

  next();
}
