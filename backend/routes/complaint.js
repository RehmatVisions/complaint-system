import express from 'express';
import {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  getComplaint,
  updateComplaint,
  addComment,
  deleteComplaint,
  getDashboardStats
} from '../controllers/complaint.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Dashboard stats
router.get('/dashboard/stats', authenticate, getDashboardStats);

// Create complaint
router.post('/', authenticate, createComplaint);

// Get user's complaints
router.get('/my-complaints', authenticate, getUserComplaints);

// Get all complaints (admin only)
router.get('/all', authenticate, requireAdmin, getAllComplaints);

// Get single complaint
router.get('/:id', authenticate, getComplaint);

// Update complaint (admin only)
router.put('/:id', authenticate, requireAdmin, updateComplaint);

// Add comment to complaint
router.post('/:id/comments', authenticate, addComment);

// Delete complaint (admin only)
router.delete('/:id', authenticate, requireAdmin, deleteComplaint);

export default router;