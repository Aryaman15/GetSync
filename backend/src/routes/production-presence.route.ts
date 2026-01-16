import { Router } from "express";
import employeeAuth from "../middlewares/employeeAuth.middleware";
import { heartbeatController } from "../controllers/production/presence.controller";

const presenceRoutes = Router();

presenceRoutes.post("/heartbeat", employeeAuth, heartbeatController);

export default presenceRoutes;
