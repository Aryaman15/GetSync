import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import EmployeeModel from "../../models/employee.model";
import { HTTPSTATUS } from "../../config/http.config";
import {
  authLoginSchema,
  authPreviewSchema,
} from "../../validation/production.validation";

export const previewEmployeeController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = authPreviewSchema.parse(req.body);
    const employee = await EmployeeModel.findOne({
      employeeId: body.employeeId,
    });

    if (!employee) {
      return res.status(HTTPSTATUS.OK).json({
        exists: false,
      });
    }

    return res.status(HTTPSTATUS.OK).json({
      exists: true,
      fullName: employee.fullName,
      phone: employee.phone,
      role: employee.role,
    });
  }
);

export const employeeLoginController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = authLoginSchema.parse(req.body);

    const employee = await EmployeeModel.findOne({
      employeeId: body.employeeId,
    }).select("+passwordHash");

    if (!employee) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Invalid employee ID or password",
      });
    }

    const isValid = await employee.comparePassword(body.password);
    if (!isValid) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Invalid employee ID or password",
      });
    }

    employee.lastSeenAt = new Date();
    await employee.save();

    req.session = {
      employeeId: employee._id.toString(),
    };

    return res.status(HTTPSTATUS.OK).json({
      message: "Logged in successfully",
      employee: {
        id: employee._id,
        employeeId: employee.employeeId,
        fullName: employee.fullName,
        phone: employee.phone,
        role: employee.role,
        workspaceId: employee.workspaceId,
      },
    });
  }
);

export const employeeLogoutController = asyncHandler(
  async (req: Request, res: Response) => {
    req.session = null;
    return res.status(HTTPSTATUS.OK).json({
      message: "Logged out successfully",
    });
  }
);

export const employeeMeController = asyncHandler(
  async (req: Request, res: Response) => {
    const employeeId = req.session?.employeeId as string | undefined;

    if (!employeeId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    return res.status(HTTPSTATUS.OK).json({
      employee: {
        id: employee._id,
        employeeId: employee.employeeId,
        fullName: employee.fullName,
        phone: employee.phone,
        role: employee.role,
        workspaceId: employee.workspaceId,
        lastSeenAt: employee.lastSeenAt,
      },
    });
  }
);
