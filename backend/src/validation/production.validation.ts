import { z } from "zod";
import {
  EmployeeRole,
  JobStatus,
  NotificationType,
  ReviewAction,
} from "../enums/production.enum";

export const employeeIdSchema = z.string().trim().min(1);
export const passwordSchema = z.string().min(4);

export const authPreviewSchema = z.object({
  employeeId: employeeIdSchema,
});

export const authLoginSchema = z.object({
  employeeId: employeeIdSchema,
  password: passwordSchema,
});

export const taskTypeSchema = z.object({
  code: z.string().trim().min(1),
  label: z.string().trim().min(1),
  isActive: z.boolean().optional(),
  category: z.string().trim().optional(),
});

export const jobCreateSchema = z.object({
  clientName: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
  projectName: z.string().trim().min(1),
  chapterScope: z.string().trim().min(1),
  taskTypeCode: z.string().trim().min(1),
  taskTypeLabel: z.string().trim().min(1),
  assignedToEmployeeId: z.string().trim().min(1),
  adminNote: z.string().trim().optional(),
});

export const jobUpdateSchema = jobCreateSchema.partial().extend({
  status: z.enum(Object.values(JobStatus) as [string, ...string[]]).optional(),
});

export const jobFiltersSchema = z.object({
  status: z.string().optional(),
  employeeId: z.string().optional(),
  clientName: z.string().optional(),
  projectId: z.string().optional(),
  taskCode: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const timerStopSchema = z.object({
  pageCountDone: z.number().int().nonnegative().optional(),
  remarks: z.string().trim().optional(),
});

export const reviewChangesSchema = z.object({
  message: z.string().trim().min(1),
});

export const notificationTypeSchema = z.enum(
  Object.values(NotificationType) as [string, ...string[]]
);

export const reviewActionSchema = z.enum(
  Object.values(ReviewAction) as [string, ...string[]]
);

export const employeeRoleSchema = z.enum(
  Object.values(EmployeeRole) as [string, ...string[]]
);
