export type EmployeeRole = "ADMIN" | "EMPLOYEE";

export type JobStatus =
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "UNDER_REVIEW"
  | "CHANGES_REQUESTED"
  | "COMPLETED";

export type ReviewAction = "SUBMITTED" | "CHANGES_REQUESTED" | "APPROVED";

export type NotificationType =
  | "JOB_ASSIGNED"
  | "JOB_SUBMITTED"
  | "JOB_APPROVED"
  | "CHANGES_REQUESTED";

export type EmployeeProfile = {
  id: string;
  employeeId: string;
  fullName: string;
  phone: string;
  role: EmployeeRole;
  workspaceId: string;
  lastSeenAt?: string | null;
};

export type TaskType = {
  _id: string;
  code: string;
  label: string;
  isActive: boolean;
  category?: string;
};

export type Job = {
  _id: string;
  clientName: string;
  projectId: string;
  projectName: string;
  chapterScope: string;
  taskTypeCode: string;
  taskTypeLabel: string;
  status: JobStatus;
  adminNote?: string;
  assignedToEmployeeId: string | { _id: string; fullName: string; employeeId: string };
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string | null;
  totalMinutes?: number;
};

export type TimeEntry = {
  _id: string;
  jobId: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  pageCountDone?: number;
  remarks?: string;
};

export type ReviewHistory = {
  _id: string;
  jobId: string;
  action: ReviewAction;
  message?: string;
  at: string;
};

export type NotificationItem = {
  _id: string;
  type: NotificationType;
  payload: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
};

export type ActiveTimer = {
  _id: string;
  jobId: string;
  employeeId: string;
  startedAt: string;
};
