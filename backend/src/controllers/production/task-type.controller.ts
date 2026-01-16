import { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import TaskTypeModel from "../../models/task-type.model";
import { HTTPSTATUS } from "../../config/http.config";
import { taskTypeSchema } from "../../validation/production.validation";

export const getTaskTypesController = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = req.employee?.workspaceId;
    const taskTypes = await TaskTypeModel.find({ workspaceId }).sort({ code: 1 });
    return res.status(HTTPSTATUS.OK).json({ taskTypes });
  }
);

export const createTaskTypeController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = taskTypeSchema.parse(req.body);
    const workspaceId = req.employee?.workspaceId;

    const taskType = await TaskTypeModel.create({
      ...body,
      workspaceId,
    });

    return res.status(HTTPSTATUS.CREATED).json({ taskType });
  }
);

export const updateTaskTypeController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = taskTypeSchema.partial().parse(req.body);
    const taskTypeId = req.params.id;
    const workspaceId = req.employee?.workspaceId;

    const taskType = await TaskTypeModel.findOneAndUpdate(
      { _id: taskTypeId, workspaceId },
      body,
      { new: true }
    );

    return res.status(HTTPSTATUS.OK).json({ taskType });
  }
);

export const deleteTaskTypeController = asyncHandler(
  async (req: Request, res: Response) => {
    const taskTypeId = req.params.id;
    const workspaceId = req.employee?.workspaceId;

    await TaskTypeModel.findOneAndDelete({ _id: taskTypeId, workspaceId });
    return res.status(HTTPSTATUS.OK).json({ message: "Task type deleted" });
  }
);
