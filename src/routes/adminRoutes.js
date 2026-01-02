const express = require('express');
const { query, param, body } = require('express-validator');
const {
  getAllComplaints,
  updateComplaintStatus,
  assignComplaint,
  addAdminReply,
} = require('../controllers/adminController');
const { auth, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(auth, authorizeRoles('admin'));

router.get(
  '/complaints',
  [
    query('status').optional().isIn(['Pending', 'In Progress', 'Resolved']),
    query('category').optional().isString(),
    query('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  getAllComplaints
);

router.put(
  '/complaints/:complaintId/status',
  [
    param('complaintId').notEmpty().withMessage('Complaint ID is required'),
    body('status')
      .isIn(['Pending', 'In Progress', 'Resolved'])
      .withMessage('Invalid status'),
    body('note').optional().isString(),
  ],
  updateComplaintStatus
);

router.put(
  '/complaints/:complaintId/assign',
  [
    param('complaintId').notEmpty().withMessage('Complaint ID is required'),
    body('assignedTo')
      .notEmpty()
      .withMessage('Assigned staff or department is required'),
  ],
  assignComplaint
);

router.post(
  '/complaints/:complaintId/reply',
  [
    param('complaintId').notEmpty().withMessage('Complaint ID is required'),
    body('message').notEmpty().withMessage('Reply message is required'),
  ],
  addAdminReply
);

module.exports = router;
