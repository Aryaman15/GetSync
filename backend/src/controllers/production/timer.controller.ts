import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import JobModel from "../../models/job.model";
import { HTTPSTATUS } from "../../config/http.config";
import ActiveTimerModel from "../../models/active-timer.model";
import { JobStatus } from "../../enums/production.enum";
import { timerStopSchema } from "../../validation/production.validation";
import { diffMinutes, formatDate } from "../../utils/time.utils";
import TimeEntryModel from "../../models/time-entry.model";

const allowedStatuses = [
  JobStatus.ASSIGNED,
  JobStatus.IN_PROGRESS,
  JobStatus.CHANGES_REQUESTED,
];

export const startTimerController = asyncHandler(
  async (req: Request, res: Response) => {
    const jobId = req.params.id;
    const employeeId = req.employee?._id;

    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Job not found" });
    }

    if (job.assignedToEmployeeId.toString() !== employeeId?.toString()) {
      return res.status(HTTPSTATUS.FORBIDDEN).json({ message: "Forbidden" });
    }

    if (!allowedStatuses.includes(job.status)) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Timer is not allowed for this job status",
      });
    }

    const activeTimer = await ActiveTimerModel.findOne({ employeeId });
    if (activeTimer) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Another timer is already running",
        activeJobId: activeTimer.jobId,
      });
    }

    const timer = await ActiveTimerModel.create({
      employeeId,
      jobId: job._id,
      startedAt: new Date(),
    });

    if (job.status === JobStatus.ASSIGNED || job.status === JobStatus.CHANGES_REQUESTED) {
      job.status = JobStatus.IN_PROGRESS;
    }
    job.lastActivityAt = new Date();
    await job.save();

    return res.status(HTTPSTATUS.OK).json({ timer });
  }
);

export const stopTimerController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = timerStopSchema.parse(req.body);
    const jobId = req.params.id;
    const employeeId = req.employee?._id;

    const timer = await ActiveTimerModel.findOne({ employeeId, jobId });
    if (!timer) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "No active timer found",
      });
    }

    const endTime = new Date();
    const durationMinutes = diffMinutes(timer.startedAt, endTime);

    const entry = await TimeEntryModel.create({
      jobId,
      employeeId,
      date: formatDate(timer.startedAt),
      startTime: timer.startedAt.toISOString(),
      endTime: endTime.toISOString(),
      durationMinutes,
      pageCountDone: body.pageCountDone,
      remarks: body.remarks,
    });

    await ActiveTimerModel.deleteOne({ _id: timer._id });

    const job = await JobModel.findById(jobId);
    if (job) {
      job.lastActivityAt = new Date();
      await job.save();
    }

    return res.status(HTTPSTATUS.OK).json({ entry });
  }
);

export const getActiveTimerController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = req.employee?._id;
    const timer = await ActiveTimerModel.findOne({ employeeId });
    return res.status(HTTPSTATUS.OK).json({ timer });
  }
);
