import mongoose, { Document, Schema } from "mongoose";
import { ReviewAction } from "../enums/production.enum";

export interface ReviewHistoryDocument extends Document {
  jobId: mongoose.Types.ObjectId;
  action: ReviewAction;
  message?: string;
  byAdminId?: mongoose.Types.ObjectId;
  at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reviewHistorySchema = new Schema<ReviewHistoryDocument>(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    action: {
      type: String,
      enum: Object.values(ReviewAction),
      required: true,
    },
    message: { type: String, trim: true },
    byAdminId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ReviewHistoryModel = mongoose.model<ReviewHistoryDocument>(
  "ReviewHistory",
  reviewHistorySchema
);

export default ReviewHistoryModel;
