import express from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Protected route for testing authentication
router.get('/protected-route', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Access granted to protected route',
    user: req.user
  });
});

// Admin-only route for testing admin middleware
router.get('/admin-only-route', authenticate, requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Access granted to admin-only route',
    user: req.user
  });
});

export default router;