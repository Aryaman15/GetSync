import { Router } from "express";
import employeeAuth from "../middlewares/employeeAuth.middleware";
import {
  getNotificationsController,
  markAllNotificationsReadController,
  markNotificationReadController,
} from "../controllers/production/notification.controller";

const notificationRoutes = Router();

notificationRoutes.get("/", employeeAuth, getNotificationsController);
notificationRoutes.post(
  "/:id/read",
  employeeAuth,
  markNotificationReadController
);
notificationRoutes.post(
  "/read-all",
  employeeAuth,
  markAllNotificationsReadController
);

export default notificationRoutes;
