export const TaskStatusEnum = {
  BACKLOG: "BACKLOG",
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  IN_REVIEW: "IN_REVIEW",
  DONE: "DONE",
} as const;

export const TaskPriorityEnum = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
} as const;
export type TaskStatusEnumType = keyof typeof TaskStatusEnum;
export type TaskPriorityEnumType = keyof typeof TaskPriorityEnum;

export const Permissions = {
  CREATE_WORKSPACE: "CREATE_WORKSPACE",
  DELETE_WORKSPACE: "DELETE_WORKSPACE",
  EDIT_WORKSPACE: "EDIT_WORKSPACE",
  MANAGE_WORKSPACE_SETTINGS: "MANAGE_WORKSPACE_SETTINGS",
  ADD_MEMBER: "ADD_MEMBER",
  CHANGE_MEMBER_ROLE: "CHANGE_MEMBER_ROLE",
  REMOVE_MEMBER: "REMOVE_MEMBER",
  CREATE_PROJECT: "CREATE_PROJECT",
  EDIT_PROJECT: "EDIT_PROJECT",
  DELETE_PROJECT: "DELETE_PROJECT",
  CREATE_TASK: "CREATE_TASK",
  EDIT_TASK: "EDIT_TASK",
  DELETE_TASK: "DELETE_TASK",
  VIEW_ONLY: "VIEW_ONLY",
} as const;

export type PermissionType = keyof typeof Permissions;

export const EMPLOYEE_CREDENTIALS = [
  {
    name: "Arjun Aswal",
    employeeCode: "COK001",
    password: "ASA@26001",
    role: "Admin",
  },
  {
    name: "Kuldeep Rawat",
    employeeCode: "COK002",
    password: "KSR@26002",
    role: "Admin",
  },
  {
    name: "Nirdosh Kumar",
    employeeCode: "COK003",
    password: "NKV@26003",
    role: "Admin",
  },
  {
    name: "Ashish Rawat",
    employeeCode: "COK004",
    password: "Ashish@26004",
    role: "Employee",
  },
  {
    name: "Vishal Kumar",
    employeeCode: "COK005",
    password: "Vishal@26005",
    role: "Employee",
  },
  {
    name: "Tannu",
    employeeCode: "COK006",
    password: "Tannu@26006",
    role: "Employee",
  },
  {
    name: "Sagar",
    employeeCode: "COK007",
    password: "Sagar@26007",
    role: "Employee",
  },
  {
    name: "Mansi",
    employeeCode: "COK008",
    password: "Mansi@26008",
    role: "Employee",
  },
  {
    name: "Nikhil",
    employeeCode: "COK009",
    password: "Nikhil@26009",
    role: "Employee",
  },
  {
    name: "Soumya",
    employeeCode: "COK010",
    password: "Soumya@26010",
    role: "Employee",
  },
  {
    name: "Sujata",
    employeeCode: "COK011",
    password: "Sujata@26011",
    role: "Employee",
  },
  {
    name: "Aditi",
    employeeCode: "COK012",
    password: "Aditi@26012",
    role: "Employee",
  },
  {
    name: "Diksha",
    employeeCode: "COK013",
    password: "Diksha@26013",
    role: "Employee",
  },
  {
    name: "Ambika",
    employeeCode: "COK014",
    password: "Ambika@26014",
    role: "Employee",
  },
  {
    name: "Pankaj Santra",
    employeeCode: "COK015",
    password: "Pankaj@260015",
    role: "Employee",
  },
] as const;
