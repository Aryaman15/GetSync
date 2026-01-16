import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../../config/http.config";
import NotificationModel from "../../models/notification.model";
import { EmployeeRole } from "../../enums/production.enum";

export const getNotificationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const employee = req.employee;
    const workspaceId = employee?.workspaceId;

    const notifications = await NotificationModel.find({
      workspaceId,
      $or: [
        { toEmployeeId: employee?._id },
        { toRole: employee?.role ?? EmployeeRole.EMPLOYEE },
      ],
    }).sort({ createdAt: -1 });

    return res.status(HTTPSTATUS.OK).json({ notifications });
  }
);

export const markNotificationReadController = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const notification = await NotificationModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    return res.status(HTTPSTATUS.OK).json({ notification });
  }
);

export const markAllNotificationsReadController = asyncHandler(
  async (req: Request, res: Response) => {
    const employee = req.employee;
    const workspaceId = employee?.workspaceId;

    await NotificationModel.updateMany(
      {
        workspaceId,
        $or: [
          { toEmployeeId: employee?._id },
          { toRole: employee?.role ?? EmployeeRole.EMPLOYEE },
        ],
      },
      { isRead: true }
    );

    return res.status(HTTPSTATUS.OK).json({ message: "All notifications read" });
  }
);
