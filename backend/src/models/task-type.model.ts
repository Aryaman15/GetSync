import mongoose, { Document, Schema } from "mongoose";

export interface TaskTypeDocument extends Document {
  code: string;
  label: string;
  isActive: boolean;
  category?: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

const taskTypeSchema = new Schema<TaskTypeDocument>(
  {
    code: { type: String, required: true, unique: true, trim: true },
    label: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    category: { type: String, trim: true },
    workspaceId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

const TaskTypeModel = mongoose.model<TaskTypeDocument>(
  "TaskType",
  taskTypeSchema
);

export default TaskTypeModel;
