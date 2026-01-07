import mongoose from "mongoose";
import Complaint from "../Models/ComplaintModel.js";

export const complaintOwnershipMiddleware = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid complaint ID" });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.complaint = complaint;
    next();

  } catch (err) {
    console.error("Ownership Middleware Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
