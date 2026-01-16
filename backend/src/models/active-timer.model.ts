import mongoose, { Document, Schema } from "mongoose";

export interface ActiveTimerDocument extends Document {
  employeeId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  startedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const activeTimerSchema = new Schema<ActiveTimerDocument>(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true,
    },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    startedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ActiveTimerModel = mongoose.model<ActiveTimerDocument>(
  "ActiveTimer",
  activeTimerSchema
);

export default ActiveTimerModel;
