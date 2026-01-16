import { Router } from "express";
import employeeAuth from "../middlewares/employeeAuth.middleware";
import requireEmployeeRole from "../middlewares/requireEmployeeRole.middleware";
import { EmployeeRole } from "../enums/production.enum";
import {
  approveJobController,
  createJobController,
  getJobDetailController,
  getJobsController,
  requestChangesJobController,
  submitJobController,
  updateJobController,
} from "../controllers/production/job.controller";

const jobsRoutes = Router();

jobsRoutes.post(
  "/",
  employeeAuth,
  requireEmployeeRole(EmployeeRole.ADMIN),
  createJobController
);

jobsRoutes.get(
  "/",
  employeeAuth,
  requireEmployeeRole(EmployeeRole.ADMIN),
  getJobsController
);

jobsRoutes.patch(
  "/:id",
  employeeAuth,
  requireEmployeeRole(EmployeeRole.ADMIN),
  updateJobController
);

jobsRoutes.post(
  "/:id/review/approve",
  employeeAuth,
  requireEmployeeRole(EmployeeRole.ADMIN),
  approveJobController
);

jobsRoutes.post(
  "/:id/review/changes-requested",
  employeeAuth,
  requireEmployeeRole(EmployeeRole.ADMIN),
  requestChangesJobController
);

jobsRoutes.get("/:id", employeeAuth, getJobDetailController);

jobsRoutes.post("/:id/submit", employeeAuth, submitJobController);

export default jobsRoutes;
