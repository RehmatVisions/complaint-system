import express from "express";
import { authMiddleware } from "../Middlewares/AuthMiddleware.js";
import { complaintOwnershipMiddleware } from "../Middlewares/OwnershipMiddleware.js";

import {
  submitComplaint,
  getOwnComplaints,
  getSingleComplaint,
  updateComplaint,
  deleteComplaint
} from "../Controllers/ComplaintController.js";

const router = express.Router();

/* CREATE */
router.post("/complaints", authMiddleware, submitComplaint);

/* READ */
router.get("/complaints", authMiddleware, getOwnComplaints);
router.get( "/complaints/:id", authMiddleware, complaintOwnershipMiddleware, getSingleComplaint);

/* UPDATE */
router.put( "/complaints/:id", authMiddleware, complaintOwnershipMiddleware, updateComplaint);

/* DELETE */
router.delete( "/complaints/:id",authMiddleware, complaintOwnershipMiddleware, deleteComplaint);

export default router;
