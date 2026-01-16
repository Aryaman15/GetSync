import { getEnv } from "../utils/get-env";
//since dotevn is not working, directly provide the link at here as the defined value
const appConfig=()=>({
    NODE_ENV:getEnv("NODE_ENV","development"),
    PORT:getEnv("PORT","8000"),
    BASE_PATH:getEnv("BASE_PATH","/api"),
    MONGO_URI:getEnv("MONGO_URI","mongodb://127.0.0.1:27017/ProjectManagement?replicaSet=rs0"),

    JWT_SECRET:getEnv("JWT_SECRET","jwt_secret_key"),
    JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN","1d"),

    SESSION_SECRET:getEnv("SESSION_SECRET"," "),
    SESSION_EXPIRES_IN:getEnv("SESSION_EXPIRES_IN"," "),

    GOOGLE_CLIENT_ID:getEnv("GOOGLE_CLIENT_ID","917246849705-a84com2a661g4dpni12m3as8g7u7q8mo.apps.googleusercontent.com"),
    GOOGLE_CLIENT_SECRET:getEnv("GOOGLE_CLIENT_SECRET","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"),
    GOOGLE_CALLBACK_URL:getEnv("GOOGLE_CALLBACK_URL","http://localhost:8000/api/auth/google/callback"),

    FRONTEND_ORIGIN:getEnv("FRONTEND_ORIGIN","http://localhost:5173"),
    FRONTEND_GOOGLE_CALLBACK_URL:getEnv("FRONTEND_GOOGLE_CALLBACK_URL","http://localhost:5173/google/oauth/callback")

});
export const config=appConfig();
//can call every method of appconfig using config.mongouri