import { Router } from "express";
import employeeAuth from "../middlewares/employeeAuth.middleware";
import { getEmployeeJobsController } from "../controllers/production/job.controller";

const employeeJobsRoutes = Router();

employeeJobsRoutes.get("/jobs", employeeAuth, getEmployeeJobsController);

export default employeeJobsRoutes;
