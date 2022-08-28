import { dbClientWithoutConnect as redisOMdbClientWithoutConnect } from "@onesocial/shared";
import dotenv from 'dotenv'
import { RedisPubSub } from "graphql-redis-subscriptions";
dotenv.config()


import { createClient } from 'redis';


const endpoint = `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}`;

const redisClient = createClient({
  url: endpoint
});

redisClient.on('error', (err) => console.log('[main]: Redis Client Error', err));
redisClient.connect();

redisOMdbClientWithoutConnect.use(redisClient).catch((err) => {
  console.log("Redis Client Error", err);
});


const redisPubSubClient = new RedisPubSub({
  connection: endpoint
});

export { redisOMdbClientWithoutConnect as redisOMdbClient, redisClient, redisPubSubClient };


