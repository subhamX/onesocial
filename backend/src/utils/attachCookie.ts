import {Response} from 'express'

export const attachCookie = (res: Response, key: string, value: string) => {
    return res.cookie(key, value, {
        secure: process.env.USE_SECURE_COOKIE === "1" ? true : false,
        sameSite: "lax",
        httpOnly: true,
        maxAge: 7 * 24 * 3600000, // 7 days
    });
}
