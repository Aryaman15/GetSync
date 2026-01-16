import "dotenv/config";
import connectDatabase from "../config/database.config";
import EmployeeModel from "../models/employee.model";
import TaskTypeModel from "../models/task-type.model";
import JobModel from "../models/job.model";
import { EmployeeRole, JobStatus } from "../enums/production.enum";

const seedProduction = async () => {
  console.log("Seeding production workflow data...");

  await connectDatabase();

  const workspaceId = "workspace-publishing-demo";

  await EmployeeModel.deleteMany({ workspaceId });
  await TaskTypeModel.deleteMany({ workspaceId });
  await JobModel.deleteMany({ workspaceId });

  const admin = await EmployeeModel.create({
    employeeId: "ADMIN-001",
    fullName: "Morgan Editor",
    phone: "+1 (555) 010-0001",
    passwordHash: "admin1234",
    role: EmployeeRole.ADMIN,
    workspaceId,
  });

  const employeeOne = await EmployeeModel.create({
    employeeId: "EMP-101",
    fullName: "Taylor Reed",
    phone: "+1 (555) 010-1010",
    passwordHash: "employee1234",
    role: EmployeeRole.EMPLOYEE,
    workspaceId,
  });

  const employeeTwo = await EmployeeModel.create({
    employeeId: "EMP-202",
    fullName: "Jordan Blake",
    phone: "+1 (555) 010-2020",
    passwordHash: "employee1234",
    role: EmployeeRole.EMPLOYEE,
    workspaceId,
  });

  const taskTypes = await TaskTypeModel.insertMany([
    { code: "1001-1", label: "Copy Editing", isActive: true, workspaceId },
    { code: "1002-1", label: "Proofreading", isActive: true, workspaceId },
    { code: "1006-1", label: "Indexing", isActive: true, workspaceId },
    { code: "9999-1", label: "Special Projects", isActive: true, workspaceId },
  ]);

  await JobModel.insertMany([
    {
      workspaceId,
      clientName: "Arcadia Publishing",
      projectId: "ARC-2024-11",
      projectName: "Modern Histories",
      chapterScope: "Chapters 1-3",
      taskTypeCode: taskTypes[0].code,
      taskTypeLabel: taskTypes[0].label,
      assignedToEmployeeId: employeeOne._id,
      status: JobStatus.ASSIGNED,
      adminNote: "Focus on factual consistency.",
      createdByAdminId: admin._id,
    },
    {
      workspaceId,
      clientName: "Brightline Media",
      projectId: "BL-778",
      projectName: "Health Atlas",
      chapterScope: "Appendix A",
      taskTypeCode: taskTypes[1].code,
      taskTypeLabel: taskTypes[1].label,
      assignedToEmployeeId: employeeOne._id,
      status: JobStatus.IN_PROGRESS,
      adminNote: "Track figures carefully.",
      createdByAdminId: admin._id,
    },
    {
      workspaceId,
      clientName: "Northwind Press",
      projectId: "NW-550",
      projectName: "Urban Landscapes",
      chapterScope: "Chapters 4-5",
      taskTypeCode: taskTypes[2].code,
      taskTypeLabel: taskTypes[2].label,
      assignedToEmployeeId: employeeTwo._id,
      status: JobStatus.CHANGES_REQUESTED,
      adminNote: "Please recheck citation formatting.",
      createdByAdminId: admin._id,
    },
  ]);

  console.log("Production workflow seed complete.");
  process.exit(0);
};

seedProduction().catch((error) => {
  console.error("Error seeding production workflow:", error);
  process.exit(1);
});
