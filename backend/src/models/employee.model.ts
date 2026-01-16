import mongoose, { Document, Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";
import { EmployeeRole } from "../enums/production.enum";

export interface EmployeeDocument extends Document {
  employeeId: string;
  fullName: string;
  phone: string;
  passwordHash: string;
  role: EmployeeRole;
  workspaceId: string;
  lastSeenAt: Date | null;
  comparePassword(value: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<EmployeeDocument>(
  {
    employeeId: { type: String, required: true, unique: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(EmployeeRole),
      default: EmployeeRole.EMPLOYEE,
    },
    workspaceId: { type: String, required: true, index: true },
    lastSeenAt: { type: Date, default: null },
  },
  { timestamps: true }
);

employeeSchema.pre("save", async function (next) {
  if (this.isModified("passwordHash")) {
    this.passwordHash = await hashValue(this.passwordHash);
  }
  next();
});

employeeSchema.methods.comparePassword = async function (value: string) {
  return compareValue(value, this.passwordHash);
};

const EmployeeModel = mongoose.model<EmployeeDocument>(
  "Employee",
  employeeSchema
);

export default EmployeeModel;
