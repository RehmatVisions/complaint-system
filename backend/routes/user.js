import express from 'express';
import { 
  getUserProfile, 
  updateUserProfile, 
  changePassword 
} from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// GET /api/users/profile - Get user profile
router.get('/profile', authenticate, getUserProfile);

// PUT /api/users/profile - Update user profile
router.put('/profile', authenticate, updateUserProfile);

// PUT /api/users/change-password - Change password
router.put('/change-password', authenticate, changePassword);

export default router;