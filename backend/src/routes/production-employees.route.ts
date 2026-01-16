import { Router } from "express";
import employeeAuth from "../middlewares/employeeAuth.middleware";
import requireEmployeeRole from "../middlewares/requireEmployeeRole.middleware";
import { EmployeeRole } from "../enums/production.enum";
import {
  getEmployeeInsightsController,
  getEmployeesController,
} from "../controllers/production/employee.controller";

const employeeRoutes = Router();

employeeRoutes.get(
  "/",
  employeeAuth,
  requireEmployeeRole(EmployeeRole.ADMIN),
  getEmployeesController
);

employeeRoutes.get(
  "/:employeeId/insights",
  employeeAuth,
  requireEmployeeRole(EmployeeRole.ADMIN),
  getEmployeeInsightsController
);

export default employeeRoutes;
