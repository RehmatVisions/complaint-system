import Complaint from "../Models/ComplaintModel.js";

export const complaintOwnershipMiddleware = async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.id });
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (complaint.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied. This is not your complaint." });
    }

    req.complaint = complaint;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error in ownership middleware" });
  }
};
