import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../../config/http.config";
import EmployeeModel from "../../models/employee.model";

export const heartbeatController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = req.employee?._id;
    const employee = await EmployeeModel.findByIdAndUpdate(
      employeeId,
      { lastSeenAt: new Date() },
      { new: true }
    );

    return res.status(HTTPSTATUS.OK).json({ employee });
  }
);
