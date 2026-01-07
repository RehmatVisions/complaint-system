import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import Complaint from "../Models/ComplaintModel.js";
import { complaintValidationSchema } from "../Validations/ComplaintValidation.js";

/* POST — Submit Complaint */
export const submitComplaint = async (req, res) => {
  try {
    const { error } = complaintValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const complaint = await Complaint.create({
      complaintId: uuidv4(),
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      priority: req.body.priority,
      status: "Pending"
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint
    });

  } catch (err) {
    console.error("Submit Complaint Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* GET — User's Own Complaints */
export const getOwnComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: complaints.length,
      complaints
    });

  } catch (err) {
    console.error("Get Own Complaints Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* GET — Single Complaint by ID (Ownership checked by middleware) */
export const getSingleComplaint = async (req, res) => {
  res.status(200).json({
    success: true,
    complaint: req.complaint
  });
};

/* PUT — Update Complaint (title, description only) */
export const updateComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title && !description) {
      return res.status(400).json({
        message: "Nothing to update"
      });
    }

    if (title) req.complaint.title = title;
    if (description) req.complaint.description = description;

    await req.complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint updated successfully",
      complaint: req.complaint
    });

  } catch (err) {
    console.error("Update Complaint Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* DELETE — Delete Complaint */
export const deleteComplaint = async (req, res) => {
  try {
    await req.complaint.deleteOne();

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully"
    });

  } catch (err) {
    console.error("Delete Complaint Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
