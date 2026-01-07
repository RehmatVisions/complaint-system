const mongoose = require('mongoose');
const generateComplaintId = require('../utils/generateComplaintId');

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    note: String,
  },
  { _id: false }
);

const replySchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    repliedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Low',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    complaintId: {
      type: String,
      unique: true,
      required: true,
      default: generateComplaintId,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: String,
      trim: true,
    },
    replies: [replySchema],
    statusHistory: [statusHistorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
