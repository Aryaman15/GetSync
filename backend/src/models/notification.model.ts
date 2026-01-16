import mongoose, { Document, Schema } from "mongoose";
import { EmployeeRole, NotificationType } from "../enums/production.enum";

export interface NotificationDocument extends Document {
  workspaceId: string;
  toEmployeeId?: mongoose.Types.ObjectId;
  toRole?: EmployeeRole;
  type: NotificationType;
  payload: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    workspaceId: { type: String, required: true, index: true },
    toEmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    toRole: { type: String, enum: Object.values(EmployeeRole) },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    payload: { type: Schema.Types.Mixed, default: {} },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model<NotificationDocument>(
  "Notification",
  notificationSchema
);

export default NotificationModel;
