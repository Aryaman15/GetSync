import mongoose, { Document, Schema } from "mongoose";

export interface TimeEntryDocument extends Document {
  jobId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  pageCountDone?: number;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const timeEntrySchema = new Schema<TimeEntryDocument>(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    pageCountDone: { type: Number },
    remarks: { type: String, trim: true },
  },
  { timestamps: true }
);

const TimeEntryModel = mongoose.model<TimeEntryDocument>(
  "TimeEntry",
  timeEntrySchema
);

export default TimeEntryModel;
