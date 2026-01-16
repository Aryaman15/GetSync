import GoogleOAuthFailure from "@/page/auth/GoogleOAuthFailure";
import SignIn from "@/page/auth/Sign-in";
import SignUp from "@/page/auth/Sign-up";
import WorkspaceDashboard from "@/page/workspace/Dashboard";
import Members from "@/page/workspace/Members";
import ProjectDetails from "@/page/workspace/ProjectDetails";
import Settings from "@/page/workspace/Settings";
import Tasks from "@/page/workspace/Tasks";
import { AUTH_ROUTES, BASE_ROUTE, PROTECTED_ROUTES, PRODUCTION_ROUTES } from "./routePaths";
import InviteUser from "@/page/invite/InviteUser";
import ProductionLoginAdmin from "@/page/production/ProductionLoginAdmin";
import ProductionLoginEmployee from "@/page/production/ProductionLoginEmployee";
import AdminDashboard from "@/page/production/AdminDashboard";
import AdminCreateJob from "@/page/production/AdminCreateJob";
import AdminReviewInbox from "@/page/production/AdminReviewInbox";
import AdminEmployees from "@/page/production/AdminEmployees";
import AdminEmployeeInsights from "@/page/production/AdminEmployeeInsights";
import AdminJobsManagement from "@/page/production/AdminJobsManagement";
import EmployeeWorkQueue from "@/page/production/EmployeeWorkQueue";
import EmployeeWorkScreen from "@/page/production/EmployeeWorkScreen";
import EmployeeCompletedWork from "@/page/production/EmployeeCompletedWork";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK, element: <GoogleOAuthFailure /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.WORKSPACE, element: <WorkspaceDashboard /> },
  { path: PROTECTED_ROUTES.TASKS, element: <Tasks /> },
  { path: PROTECTED_ROUTES.MEMBERS, element: <Members /> },
  { path: PROTECTED_ROUTES.SETTINGS, element: <Settings /> },
  { path: PROTECTED_ROUTES.PROJECT_DETAILS, element: <ProjectDetails /> },
];

export const baseRoutePaths = [
  { path: BASE_ROUTE.INVITE_URL, element: <InviteUser /> },
  { path: PRODUCTION_ROUTES.LOGIN, element: <ProductionLoginEmployee /> },
  { path: PRODUCTION_ROUTES.LOGIN_ADMIN, element: <ProductionLoginAdmin /> },
  { path: PRODUCTION_ROUTES.LOGIN_EMPLOYEE, element: <ProductionLoginEmployee /> },
];

export const productionProtectedRoutePaths = [
  { path: PRODUCTION_ROUTES.ADMIN_DASHBOARD, element: <AdminDashboard /> },
  { path: PRODUCTION_ROUTES.ADMIN_CREATE_JOB, element: <AdminCreateJob /> },
  { path: PRODUCTION_ROUTES.ADMIN_REVIEW, element: <AdminReviewInbox /> },
  { path: PRODUCTION_ROUTES.ADMIN_EMPLOYEES, element: <AdminEmployees /> },
  { path: PRODUCTION_ROUTES.ADMIN_EMPLOYEE_INSIGHTS, element: <AdminEmployeeInsights /> },
  { path: PRODUCTION_ROUTES.ADMIN_JOBS, element: <AdminJobsManagement /> },
  { path: PRODUCTION_ROUTES.EMPLOYEE_QUEUE, element: <EmployeeWorkQueue /> },
  { path: PRODUCTION_ROUTES.EMPLOYEE_JOB, element: <EmployeeWorkScreen /> },
  { path: PRODUCTION_ROUTES.EMPLOYEE_COMPLETED, element: <EmployeeCompletedWork /> },
];
