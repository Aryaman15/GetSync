import { Router } from "express";
import employeeAuth from "../middlewares/employeeAuth.middleware";
import requireEmployeeRole from "../middlewares/requireEmployeeRole.middleware";
import { EmployeeRole } from "../enums/production.enum";
import {
  getEmployeeReportController,
  getSummaryReportController,
  getTimeEntriesController,
} from "../controllers/production/report.controller";

const reportRoutes = Router();

reportRoutes.get(
  "/time-entries",
  employeeAuth,
  requireEmployeeRole(EmployeeRole.ADMIN),
  getTimeEntriesController
);

reportRoutes.get(
  "/reports/employee/:employeeId",
  employeeAuth,
  requireEmployeeRole(EmployeeRole.ADMIN),
  getEmployeeReportController
);

reportRoutes.get(
  "/reports/summary",
  employeeAuth,
  requireEmployeeRole(EmployeeRole.ADMIN),
  getSummaryReportController
);

export default reportRoutes;
