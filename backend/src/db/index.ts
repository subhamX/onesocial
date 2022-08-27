import dotenv from "dotenv";
import { dbClientWithoutConnect } from "@onesocial/shared";

dotenv.config();
const endpoint = `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}`;

dbClientWithoutConnect.open(endpoint).catch((err) => {
  console.log("Redis Client Error", err);
});

export { dbClientWithoutConnect as dbClient };
