import { Router } from "express";
import employeeAuth from "../middlewares/employeeAuth.middleware";
import requireEmployeeRole from "../middlewares/requireEmployeeRole.middleware";
import { EmployeeRole } from "../enums/production.enum";
import {
  createTaskTypeController,
  deleteTaskTypeController,
  getTaskTypesController,
  updateTaskTypeController,
} from "../controllers/production/task-type.controller";

const taskTypeRoutes = Router();

taskTypeRoutes.get("/", employeeAuth, getTaskTypesController);

taskTypeRoutes.post(
  "/",
  employeeAuth,
  requireEmployeeRole(EmployeeRole.ADMIN),
  createTaskTypeController
);

taskTypeRoutes.patch(
  "/:id",
  employeeAuth,
  requireEmployeeRole(EmployeeRole.ADMIN),
  updateTaskTypeController
);

taskTypeRoutes.delete(
  "/:id",
  employeeAuth,
  requireEmployeeRole(EmployeeRole.ADMIN),
  deleteTaskTypeController
);

export default taskTypeRoutes;
