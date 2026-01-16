export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};

export const AUTH_ROUTES = {
  SIGN_IN: "/",
  SIGN_UP: "/sign-up",
  GOOGLE_OAUTH_CALLBACK: "/google/oauth/callback",
};

export const PROTECTED_ROUTES = {
  WORKSPACE: "/workspace/:workspaceId",
  TASKS: "/workspace/:workspaceId/tasks",
  MEMBERS: "/workspace/:workspaceId/members",
  SETTINGS: "/workspace/:workspaceId/settings",
  PROJECT_DETAILS: "/workspace/:workspaceId/project/:projectId",
};

export const BASE_ROUTE = {
  INVITE_URL: "/invite/workspace/:inviteCode/join",
};

export const PRODUCTION_ROUTES = {
  LOGIN: "/production/login",
  LOGIN_ADMIN: "/production/login/admin",
  LOGIN_EMPLOYEE: "/production/login/employee",
  ADMIN_DASHBOARD: "/production/admin",
  ADMIN_CREATE_JOB: "/production/admin/create-job",
  ADMIN_REVIEW: "/production/admin/review",
  ADMIN_EMPLOYEES: "/production/admin/employees",
  ADMIN_EMPLOYEE_INSIGHTS: "/production/admin/employees/:employeeId",
  ADMIN_JOBS: "/production/admin/jobs",
  EMPLOYEE_QUEUE: "/production/employee",
  EMPLOYEE_JOB: "/production/employee/jobs/:jobId",
  EMPLOYEE_COMPLETED: "/production/employee/completed",
};
