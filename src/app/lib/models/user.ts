import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  studentNumber: {
    type: String,
    required: true,
    unique: true,
  },
  schoolEmail: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  program: {
    type: String,
    required: true,
  },
  isScholar: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
