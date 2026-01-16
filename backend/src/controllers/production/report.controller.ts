import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../../config/http.config";
import TimeEntryModel from "../../models/time-entry.model";
import JobModel from "../../models/job.model";
import EmployeeModel from "../../models/employee.model";
import { JobStatus } from "../../enums/production.enum";

export const getTimeEntriesController = asyncHandler(
  async (_req: Request, res: Response) => {
    const workspaceId = _req.employee?.workspaceId;
    const jobs = await JobModel.find({ workspaceId }).select("_id");
    const jobIds = jobs.map((job) => job._id);
    const entries = await TimeEntryModel.find({ jobId: { $in: jobIds } }).sort({ createdAt: -1 });
    return res.status(HTTPSTATUS.OK).json({ entries });
  }
);

export const getEmployeeReportController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = req.params.employeeId;
    const workspaceId = req.employee?.workspaceId;

    const employee = await EmployeeModel.findById(employeeId);
    if (!employee || employee.workspaceId !== workspaceId) {
      return res.status(HTTPSTATUS.NOT_FOUND).json({ message: "Employee not found" });
    }

    const entries = await TimeEntryModel.find({ employeeId });
    const totalMinutes = entries.reduce(
      (sum, entry) => sum + entry.durationMinutes,
      0
    );

    const jobsCompleted = await JobModel.countDocuments({
      assignedToEmployeeId: employeeId,
      status: JobStatus.COMPLETED,
    });

    const jobsActive = await JobModel.countDocuments({
      assignedToEmployeeId: employeeId,
      status: { $in: [JobStatus.ASSIGNED, JobStatus.IN_PROGRESS] },
    });

    return res.status(HTTPSTATUS.OK).json({
      totalMinutes,
      jobsCompleted,
      jobsActive,
      entries,
    });
  }
);

export const getSummaryReportController = asyncHandler(
  async (_req: Request, res: Response) => {
    const workspaceId = _req.employee?.workspaceId;
    const employees = await EmployeeModel.find({ workspaceId });
    const jobs = await JobModel.find({ workspaceId });
    const jobIds = jobs.map((job) => job._id);
    const entries = await TimeEntryModel.find({ jobId: { $in: jobIds } });

    const totalMinutes = entries.reduce(
      (sum, entry) => sum + entry.durationMinutes,
      0
    );

    const jobsByStatus = jobs.reduce<Record<string, number>>((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {});

    const jobsByClient = jobs.reduce<Record<string, number>>((acc, job) => {
      acc[job.clientName] = (acc[job.clientName] || 0) + 1;
      return acc;
    }, {});

    const hoursByEmployee = employees.map((employee) => {
      const employeeEntries = entries.filter(
        (entry) => entry.employeeId.toString() === employee._id.toString()
      );
      const minutes = employeeEntries.reduce(
        (sum, entry) => sum + entry.durationMinutes,
        0
      );

      return {
        employeeId: employee.employeeId,
        fullName: employee.fullName,
        minutes,
      };
    });

    return res.status(HTTPSTATUS.OK).json({
      totals: {
        totalMinutes,
      },
      jobsByStatus,
      jobsByClient,
      hoursByEmployee,
    });
  }
);
