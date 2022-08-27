import { UserModel, jwtUserPayloadType, PotentialUserModel } from "@onesocial/shared";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { attachCookie } from "./attachCookie";


/**
 * Utility function to set auth token
 */
export const setAuthTokenAsCookie = (res: Response, user: UserModel) => {
    // create auth token
    const jwtPayload: jwtUserPayloadType = {
        id: user.id,
        email: user.email,
        name: user.name
    };

    const token = jwt.sign(jwtPayload, process.env.JSON_WEB_TOKEN_SECRET ?? "");
    return attachCookie(res, "oneSocialKeeper", token)
};


/**
 * Utility function to set tmp auth token
 */
 export const setTmpAuthTokenAsCookie = (res: Response, instance: PotentialUserModel) => {
    const token = jwt.sign(instance.toJSON(), process.env.JSON_WEB_TOKEN_SECRET ?? "");
    return attachCookie(res, "oneSocialKeeperTmp", token)
};
