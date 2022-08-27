import { authSchema } from "./auth";
import { devSchema } from "./devSchema";

export const mergedTypeDefs = [authSchema, devSchema];
