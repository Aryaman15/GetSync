import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import { googleLoginCallback, loginController, logOutController, registerUserController } from "../controllers/auth.controller";
import {
  employeeLoginByRoleController,
  employeeLoginController,
  employeeLogoutController,
  employeeMeController,
  previewEmployeeByRoleController,
  previewEmployeeController,
} from "../controllers/production/auth.controller";
import { EmployeeRole } from "../enums/production.enum";

const failedUrl=`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
const authRoutes=Router();

authRoutes.post("/register",registerUserController);
authRoutes.post("/preview", previewEmployeeController);
authRoutes.post("/preview/admin", previewEmployeeByRoleController(EmployeeRole.ADMIN));
authRoutes.post(
  "/preview/employee",
  previewEmployeeByRoleController(EmployeeRole.EMPLOYEE)
);
authRoutes.post("/login", (req, res, next) => {
  if (req.body?.employeeId) {
    return employeeLoginController(req, res, next);
  }
  return loginController(req, res, next);
});
authRoutes.post("/login/admin", employeeLoginByRoleController(EmployeeRole.ADMIN));
authRoutes.post(
  "/login/employee",
  employeeLoginByRoleController(EmployeeRole.EMPLOYEE)
);
authRoutes.post("/logout", (req, res, next) => {
  if (req.session?.employeeId) {
    return employeeLogoutController(req, res, next);
  }
  return logOutController(req, res);
});
authRoutes.get("/me", employeeMeController);
authRoutes.get(
    "/google",
    passport.authenticate("google",{
        scope:["profile","email"],
        session:false,
    })
);

authRoutes.get("/google/callback",
    passport.authenticate("google",{
        failureRedirect:""
    }),
    googleLoginCallback
)
export default authRoutes;
