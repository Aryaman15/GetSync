import { Router } from "express";
import employeeAuth from "../middlewares/employeeAuth.middleware";
import {
  getActiveTimerController,
  startTimerController,
  stopTimerController,
} from "../controllers/production/timer.controller";

const timerRoutes = Router();

timerRoutes.post("/jobs/:id/timer/start", employeeAuth, startTimerController);

timerRoutes.post("/jobs/:id/timer/stop", employeeAuth, stopTimerController);

timerRoutes.get("/timers/active", employeeAuth, getActiveTimerController);

export default timerRoutes;
