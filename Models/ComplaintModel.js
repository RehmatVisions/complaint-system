import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    title: { type: String, required: true, minlength: 3 },
    description: { type: String, required: true, minlength: 10 },
    category: { type: String, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], required: true },
    status: { type: String, enum: ["Pending", "In Progress", "Resolved"], default: "Pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", ComplaintSchema);
