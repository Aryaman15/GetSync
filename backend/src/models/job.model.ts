import mongoose, { Document, Schema } from "mongoose";
import { JobStatus } from "../enums/production.enum";

export interface JobDocument extends Document {
  workspaceId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  chapterScope: string;
  taskTypeCode: string;
  taskTypeLabel: string;
  assignedToEmployeeId: mongoose.Types.ObjectId;
  status: JobStatus;
  adminNote?: string;
  createdByAdminId: mongoose.Types.ObjectId;
  lastActivityAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<JobDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    clientName: { type: String, required: true, trim: true },
    projectId: { type: String, required: true, trim: true },
    projectName: { type: String, required: true, trim: true },
    chapterScope: { type: String, required: true, trim: true },
    taskTypeCode: { type: String, required: true, trim: true },
    taskTypeLabel: { type: String, required: true, trim: true },
    assignedToEmployeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.ASSIGNED,
    },
    adminNote: { type: String, trim: true },
    createdByAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    lastActivityAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const JobModel = mongoose.model<JobDocument>("Job", jobSchema);

export default JobModel;
