import { Request, Response, NextFunction } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { EmployeeRole } from "../enums/production.enum";

const requireEmployeeRole = (role: EmployeeRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const employee = req.employee;

    if (!employee || employee.role !== role) {
      return res.status(HTTPSTATUS.FORBIDDEN).json({
        message: "Forbidden",
        errorCode: "ROLE_FORBIDDEN",
      });
    }

    next();
  };
};

export default requireEmployeeRole;
