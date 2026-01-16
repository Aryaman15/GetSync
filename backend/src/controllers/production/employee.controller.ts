import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import EmployeeModel from "../../models/employee.model";
import { HTTPSTATUS } from "../../config/http.config";
import JobModel from "../../models/job.model";
import TimeEntryModel from "../../models/time-entry.model";
import { JobStatus } from "../../enums/production.enum";

export const getEmployeesController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = req.employee?.workspaceId;
    const employees = await EmployeeModel.find({ workspaceId }).sort({ fullName: 1 });
    return res.status(HTTPSTATUS.OK).json({ employees });
  }
);

export const getEmployeeInsightsController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = req.params.employeeId;
    const workspaceId = req.employee?.workspaceId;

    const employee = await EmployeeModel.findById(employeeId);
    if (!employee || employee.workspaceId !== workspaceId) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Employee not found" });
    }

    const jobs = await JobModel.find({ assignedToEmployeeId: employeeId });
    const entries = await TimeEntryModel.find({ employeeId });

    const totalMinutes = entries.reduce(
      (sum, entry) => sum + entry.durationMinutes,
      0
    );

    const jobsCompleted = jobs.filter((job) => job.status === JobStatus.COMPLETED).length;
    const activeJobs = jobs.filter((job) =>
      [JobStatus.ASSIGNED, JobStatus.IN_PROGRESS].includes(job.status)
    ).length;
    const underReview = jobs.filter((job) => job.status === JobStatus.UNDER_REVIEW).length;
    const changesRequested = jobs.filter(
      (job) => job.status === JobStatus.CHANGES_REQUESTED
    ).length;

    return res.status(HTTPSTATUS.OK).json({
      totals: {
        totalMinutes,
        jobsCompleted,
        activeJobs,
        underReview,
        changesRequested,
      },
      entries,
      jobs,
    });
  }
);
