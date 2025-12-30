import express from "express";
import { authMiddleware } from "../Middlewares/AuthMiddleware.js";
import { complaintOwnershipMiddleware } from "../Middlewares/OwnershipMiddleware.js";
import {
  submitComplaint,
  getOwnComplaints,
  getSingleComplaint
} from "../Controllers/ComplaintController.js";

const router = express.Router();

router.post("/submit-complaint", submitComplaint);
router.get("/get-owncomplaints", authMiddleware, getOwnComplaints);
router.get("/get-single-complaint/:id", authMiddleware, complaintOwnershipMiddleware, getSingleComplaint);

export default router;
