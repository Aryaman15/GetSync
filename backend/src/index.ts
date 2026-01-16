import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import "dotenv/config";
import express,{NextFunction, Request,Response} from "express";
import cors from "cors";
import session from "cookie-session";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";

import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import taskTypeRoutes from "./routes/production-task-types.route";
import jobsRoutes from "./routes/production-jobs.route";
import timerRoutes from "./routes/production-timer.route";
import notificationRoutes from "./routes/production-notifications.route";
import presenceRoutes from "./routes/production-presence.route";
import reportRoutes from "./routes/production-reports.route";
import employeeRoutes from "./routes/production-employees.route";
import employeeJobsRoutes from "./routes/production-employee-jobs.route";

const app=express();
const BASE_PATH=config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(
    session({
        name:"session",
        keys:[config.SESSION_SECRET],
        maxAge:24*60*60*1000,
        secure:config.NODE_ENV=="production",
        httpOnly:true,
        sameSite:"lax",
    })
)
app.use(passport.initialize());
app.use(passport.session());
app.use(
    cors({
        origin:config.FRONTEND_ORIGIN,
        credentials:true,
    })
);

app.get('/',asyncHandler(async (req:Request,res: Response,next:NextFunction)=>{
    res.status(HTTPSTATUS.OK).json({
        message:"Website Working"
    });
    })
);

app.use(`${BASE_PATH}/auth`,authRoutes);
app.use(`${BASE_PATH}/user`,isAuthenticated,userRoutes);
app.use(`${BASE_PATH}/workspace`,isAuthenticated,workspaceRoutes);
app.use(`${BASE_PATH}/member`,isAuthenticated,memberRoutes);
app.use(`${BASE_PATH}/project`,isAuthenticated,projectRoutes);
app.use(`${BASE_PATH}/task`,isAuthenticated,taskRoutes);
app.use(`${BASE_PATH}/task-types`, taskTypeRoutes);
app.use(`${BASE_PATH}/jobs`, jobsRoutes);
app.use(`${BASE_PATH}`, timerRoutes);
app.use(`${BASE_PATH}/notifications`, notificationRoutes);
app.use(`${BASE_PATH}/presence`, presenceRoutes);
app.use(`${BASE_PATH}`, reportRoutes);
app.use(`${BASE_PATH}/employees`, employeeRoutes);
app.use(`${BASE_PATH}/employee`, employeeJobsRoutes);

app.use(errorHandler);

app.listen(config.PORT,async()=>{
    console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
    await connectDatabase();
})

