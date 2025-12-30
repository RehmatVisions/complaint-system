import { v4 as uuidv4 } from "uuid";
import Complaint from "../Models/ComplaintModel.js";
import { complaintValidationSchema } from "../Validations/ComplaintValidation.js";

// POST - Submit complaint
export const submitComplaint = async (req, res) => {
  const { error } = complaintValidationSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const complaint = new Complaint({
      complaintId: uuidv4(),
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      priority: req.body.priority,
      status: "Pending"
    });

    await complaint.save();
    return res.status(201).json({ message: "Complaint submitted successfully", complaint });
  } catch (err) {
    return res.status(500).json({ message: "Server error while submitting complaint" });
  }
};

// GET - List only own complaints
export const getOwnComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id });
    return res.status(200).json({ complaints });
  } catch (err) {
    return res.status(500).json({ message: "Server error while fetching complaints" });
  }
};

// GET - Single complaint (own only)
export const getSingleComplaint = async (req, res) => {
  return res.status(200).json({ complaint: req.complaint });
};
