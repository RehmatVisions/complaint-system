import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import complaintRoutes from "./routes/complaintRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/complaints", complaintRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected"))
  .catch(err => console.log("DB Error:", err));

app.listen(5000, () => console.log("Server running on port 5000"));
