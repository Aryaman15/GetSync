import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import { googleLoginCallback, loginController, logOutController, registerUserController } from "../controllers/auth.controller";
import { employeeLoginController, employeeLogoutController, employeeMeController, previewEmployeeController } from "../controllers/production/auth.controller";

const failedUrl=`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
const authRoutes=Router();

authRoutes.post("/register",registerUserController);
authRoutes.post("/preview", previewEmployeeController);
authRoutes.post("/login", (req, res, next) => {
  if (req.body?.employeeId) {
    return employeeLoginController(req, res);
  }
  return loginController(req, res, next);
});
authRoutes.post("/logout", (req, res, next) => {
  if (req.session?.employeeId) {
    return employeeLogoutController(req, res);
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
