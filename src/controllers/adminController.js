const { validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return null;
};

exports.getAllComplaints = async (req, res) => {
  const validationError = handleValidation(req, res);
  if (validationError) return validationError;

  try {
    const { status, category, priority, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const complaints = await Complaint.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Complaint.countDocuments(query);

    res.json({
      data: complaints,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching complaints:', error.message);
    res.status(500).json({ message: 'Failed to fetch complaints' });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  const validationError = handleValidation(req, res);
  if (validationError) return validationError;

  const { complaintId } = req.params;
  const { status, note } = req.body;

  try {
    const complaint = await Complaint.findOne({ complaintId });
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    complaint.statusHistory.push({
      status,
      updatedBy: req.user._id,
      note,
    });

    await complaint.save();

    res.json({ message: 'Status updated', complaint });
  } catch (error) {
    console.error('Error updating status:', error.message);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

exports.assignComplaint = async (req, res) => {
  const validationError = handleValidation(req, res);
  if (validationError) return validationError;

  const { complaintId } = req.params;
  const { assignedTo } = req.body;

  try {
    const complaint = await Complaint.findOneAndUpdate(
      { complaintId },
      { assignedTo },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ message: 'Complaint assigned', complaint });
  } catch (error) {
    console.error('Error assigning complaint:', error.message);
    res.status(500).json({ message: 'Failed to assign complaint' });
  }
};

exports.addAdminReply = async (req, res) => {
  const validationError = handleValidation(req, res);
  if (validationError) return validationError;

  const { complaintId } = req.params;
  const { message } = req.body;

  try {
    const complaint = await Complaint.findOne({ complaintId });
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.replies.push({
      message,
      repliedBy: req.user._id,
    });

    await complaint.save();

    res.json({ message: 'Reply added', complaint });
  } catch (error) {
    console.error('Error adding reply:', error.message);
    res.status(500).json({ message: 'Failed to add reply' });
  }
};
