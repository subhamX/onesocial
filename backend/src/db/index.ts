import dotenv from "dotenv";
import { dbClientWithoutConnect } from "@onesocial/shared";
import { createClient } from "redis";

dotenv.config();
const endpoint = `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}`;


const redisClient = createClient({
  url: endpoint
});

redisClient.on('error', (err) => console.log('[main]: Redis Client Error', err));
redisClient.connect();

dbClientWithoutConnect.open(endpoint).catch((err) => {
  console.log("Redis Client Error", err);
});


export { dbClientWithoutConnect as dbClient, redisClient as redisPublishClient };
