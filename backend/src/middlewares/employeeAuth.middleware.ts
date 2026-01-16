import { Request, Response, NextFunction } from "express";
import { HTTPSTATUS } from "../config/http.config";
import EmployeeModel from "../models/employee.model";

const employeeAuth = async (req: Request, res: Response, next: NextFunction) => {
  const employeeId = req.session?.employeeId as string | undefined;

  if (!employeeId) {
    return res.status(HTTPSTATUS.UNAUTHORIZED).json({
      message: "Unauthorized",
      errorCode: "AUTH_UNAUTHORIZED",
    });
  }

  const employee = await EmployeeModel.findById(employeeId).select("+passwordHash");
  if (!employee) {
    return res.status(HTTPSTATUS.UNAUTHORIZED).json({
      message: "Employee not found",
      errorCode: "AUTH_UNAUTHORIZED",
    });
  }

  req.employee = employee;
  next();
};

export default employeeAuth;
