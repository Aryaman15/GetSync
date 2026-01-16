import { string } from "zod";
import { UserDocument } from "../models/user.model"
import { SignOptions } from "jsonwebtoken";
import { config } from "../config/app.config";
export type AccessTPayload={
    userId:UserDocument["_id"];
};

type SignOptsAndSecret=SignOptions & {
    secret: string;
};

const defaults: SignOptions={
    audience:["user"],
};

export const accessTokenSignOptions: SignOptsAndSecret={
    expiresIn:config.JWT_EXPIRES_IN,
    secret:config.JWT_SECRET,
}