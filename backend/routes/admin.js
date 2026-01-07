import express from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

// GET /api/admin/dashboard - Admin only route
router.get('/dashboard', authenticate, requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to admin dashboard',
    data: {
      totalUsers: 150,
      totalComplaints: 75,
      pendingComplaints: 25,
      adminUser: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role
      }
    }
  });
});

// GET /api/admin/users - Get all users (admin only)
router.get('/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const users = await User.find({}).select('-password');
    
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;