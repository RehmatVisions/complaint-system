import jwt from 'jsonwebtoken';

/**
 * Generate JWT token with user information
 * @param {Object} payload - User data to include in token
 * @param {string} payload.userId - User ID
 * @param {string} payload.role - User role (user/admin)
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
  const { userId, role } = payload;
  
  return jwt.sign(
    { 
      userId,
      role
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: '1d' // 1 day expiration
    }
  );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};