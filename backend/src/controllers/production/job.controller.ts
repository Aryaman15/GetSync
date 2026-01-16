import { Request, Response } from "express";
import mongoose from "mongoose";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import JobModel from "../../models/job.model";
import { HTTPSTATUS } from "../../config/http.config";
import {
  jobCreateSchema,
  jobFiltersSchema,
  jobUpdateSchema,
  reviewChangesSchema,
} from "../../validation/production.validation";
import EmployeeModel from "../../models/employee.model";
import NotificationModel from "../../models/notification.model";
import ReviewHistoryModel from "../../models/review-history.model";
import TimeEntryModel from "../../models/time-entry.model";
import { EmployeeRole, JobStatus, NotificationType, ReviewAction } from "../../enums/production.enum";
import ActiveTimerModel from "../../models/active-timer.model";

const buildJobFilters = (filters: ReturnType<typeof jobFiltersSchema.parse>) => {
  const query: Record<string, unknown> = {};

  if (filters.status) query.status = filters.status;
  if (filters.employeeId) query.assignedToEmployeeId = filters.employeeId;
  if (filters.clientName) query.clientName = new RegExp(filters.clientName, "i");
  if (filters.projectId) query.projectId = new RegExp(filters.projectId, "i");
  if (filters.taskCode) query.taskTypeCode = new RegExp(filters.taskCode, "i");

  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      (query.createdAt as Record<string, unknown>).$gte = new Date(
        filters.startDate
      );
    }
    if (filters.endDate) {
      (query.createdAt as Record<string, unknown>).$lte = new Date(
        filters.endDate
      );
    }
  }

  return query;
};

export const createJobController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = jobCreateSchema.parse(req.body);
    const workspaceId = req.employee?.workspaceId as string;

    const employee = await EmployeeModel.findById(body.assignedToEmployeeId);
    if (!employee) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({
        message: "Employee not found",
      });
    }
    if (employee.workspaceId !== workspaceId) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Employee is not in this workspace",
      });
    }

    const job = await JobModel.create({
      ...body,
      workspaceId,
      assignedToEmployeeId: new mongoose.Types.ObjectId(body.assignedToEmployeeId),
      createdByAdminId: req.employee?._id,
      status: JobStatus.ASSIGNED,
    });

    await NotificationModel.create({
      workspaceId,
      toEmployeeId: employee._id,
      type: NotificationType.JOB_ASSIGNED,
      payload: {
        jobId: job._id,
        clientName: job.clientName,
        projectId: job.projectId,
        taskTypeCode: job.taskTypeCode,
      },
    });

    return res.status(HTTPSTATUS.CREATED).json({ job });
  }
);

export const getJobsController = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = jobFiltersSchema.parse(req.query);
    const workspaceId = req.employee?.workspaceId as string;

    const jobs = await JobModel.find({
      workspaceId,
      ...buildJobFilters(filters),
    }).sort({ updatedAt: -1 });

    const jobIds = jobs.map((job) => job._id);
    const totals = await TimeEntryModel.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: "$jobId", totalMinutes: { $sum: "$durationMinutes" } } },
    ]);
    const totalsMap = new Map(
      totals.map((item: { _id: mongoose.Types.ObjectId; totalMinutes: number }) => [
        item._id.toString(),
        item.totalMinutes,
      ])
    );

    const jobsWithTotals = jobs.map((job) => ({
      ...job.toObject(),
      totalMinutes: totalsMap.get(job._id.toString()) || 0,
    }));

    return res.status(HTTPSTATUS.OK).json({ jobs: jobsWithTotals });
  }
);

export const updateJobController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = jobUpdateSchema.parse(req.body);
    const jobId = req.params.id;
    const workspaceId = req.employee?.workspaceId as string;

    const job = await JobModel.findOne({ _id: jobId, workspaceId });
    if (!job) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Job not found" });
    }

    if (job.status === JobStatus.COMPLETED) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Completed jobs cannot be edited",
      });
    }

    Object.assign(job, body);
    job.lastActivityAt = new Date();
    await job.save();

    return res.status(HTTPSTATUS.OK).json({ job });
  }
);

export const getEmployeeJobsController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = req.employee?.workspaceId as string;
    const keyword = (req.query.keyword as string) || "";
    const status = (req.query.status as string) || "";

    const query: Record<string, unknown> = {
      workspaceId,
      assignedToEmployeeId: req.employee?._id,
    };

    if (status) {
      query.status = status;
    }

    if (keyword) {
      query.$or = [
        { clientName: new RegExp(keyword, "i") },
        { projectId: new RegExp(keyword, "i") },
        { projectName: new RegExp(keyword, "i") },
        { taskTypeCode: new RegExp(keyword, "i") },
        { taskTypeLabel: new RegExp(keyword, "i") },
      ];
    }

    const jobs = await JobModel.find(query).sort({ updatedAt: -1 });
    const jobIds = jobs.map((job) => job._id);
    const totals = await TimeEntryModel.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: "$jobId", totalMinutes: { $sum: "$durationMinutes" } } },
    ]);
    const totalsMap = new Map(
      totals.map((item: { _id: mongoose.Types.ObjectId; totalMinutes: number }) => [
        item._id.toString(),
        item.totalMinutes,
      ])
    );

    const jobsWithTotals = jobs.map((job) => ({
      ...job.toObject(),
      totalMinutes: totalsMap.get(job._id.toString()) || 0,
    }));

    return res.status(HTTPSTATUS.OK).json({ jobs: jobsWithTotals });
  }
);

export const getJobDetailController = asyncHandler(
  async (req: Request, res: Response) => {
    const jobId = req.params.id;
    const job = await JobModel.findById(jobId).populate(
      "assignedToEmployeeId",
      "fullName employeeId"
    );

    if (!job) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Job not found" });
    }

    const assignedId =
      job.assignedToEmployeeId instanceof mongoose.Types.ObjectId
        ? job.assignedToEmployeeId
        : job.assignedToEmployeeId?._id;

    if (
      req.employee?.role === EmployeeRole.EMPLOYEE &&
      assignedId?.toString() !== req.employee?._id?.toString()
    ) {
      return res.status(HTTPSTATUS.FORBIDDEN).json({ message: "Forbidden" });
    }

    const timeEntries = await TimeEntryModel.find({ jobId }).sort({ createdAt: -1 });
    const reviewHistory = await ReviewHistoryModel.find({ jobId }).sort({ at: -1 });

    const totalMinutes = timeEntries.reduce(
      (sum, entry) => sum + entry.durationMinutes,
      0
    );

    return res.status(HTTPSTATUS.OK).json({
      job,
      timeEntries,
      reviewHistory,
      totals: {
        totalMinutes,
      },
    });
  }
);

export const submitJobController = asyncHandler(
  async (req: Request, res: Response) => {
    const jobId = req.params.id;
    const job = await JobModel.findById(jobId);

    if (!job) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Job not found" });
    }

    if (job.assignedToEmployeeId.toString() !== req.employee?._id?.toString()) {
      return res.status(HTTPSTATUS.FORBIDDEN).json({ message: "Forbidden" });
    }

    const activeTimer = await ActiveTimerModel.findOne({
      employeeId: req.employee?._id,
      jobId: job._id,
    });

    if (activeTimer) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Stop the timer before submitting",
      });
    }

    job.status = JobStatus.UNDER_REVIEW;
    job.lastActivityAt = new Date();
    await job.save();

    await ReviewHistoryModel.create({
      jobId: job._id,
      action: ReviewAction.SUBMITTED,
    });

    await NotificationModel.create({
      workspaceId: job.workspaceId,
      toRole: EmployeeRole.ADMIN,
      type: NotificationType.JOB_SUBMITTED,
      payload: {
        jobId: job._id,
        clientName: job.clientName,
        projectId: job.projectId,
      },
    });

    return res.status(HTTPSTATUS.OK).json({ job });
  }
);

export const approveJobController = asyncHandler(
  async (req: Request, res: Response) => {
    const jobId = req.params.id;
    const job = await JobModel.findById(jobId);

    if (!job) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Job not found" });
    }

    job.status = JobStatus.COMPLETED;
    job.lastActivityAt = new Date();
    await job.save();

    await ReviewHistoryModel.create({
      jobId: job._id,
      action: ReviewAction.APPROVED,
      byAdminId: req.employee?._id,
    });

    await NotificationModel.create({
      workspaceId: job.workspaceId,
      toEmployeeId: job.assignedToEmployeeId,
      type: NotificationType.JOB_APPROVED,
      payload: {
        jobId: job._id,
        clientName: job.clientName,
      },
    });

    return res.status(HTTPSTATUS.OK).json({ job });
  }
);

export const requestChangesJobController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = reviewChangesSchema.parse(req.body);
    const jobId = req.params.id;
    const job = await JobModel.findById(jobId);

    if (!job) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Job not found" });
    }

    job.status = JobStatus.CHANGES_REQUESTED;
    job.lastActivityAt = new Date();
    await job.save();

    await ReviewHistoryModel.create({
      jobId: job._id,
      action: ReviewAction.CHANGES_REQUESTED,
      message: body.message,
      byAdminId: req.employee?._id,
    });

    await NotificationModel.create({
      workspaceId: job.workspaceId,
      toEmployeeId: job.assignedToEmployeeId,
      type: NotificationType.CHANGES_REQUESTED,
      payload: {
        jobId: job._id,
        message: body.message,
      },
    });

    return res.status(HTTPSTATUS.OK).json({ job });
  }
);
