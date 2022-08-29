"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisPubSubClient = exports.redisClient = exports.redisOMdbClient = void 0;
const shared_1 = require("@onesocial/shared");
Object.defineProperty(exports, "redisOMdbClient", { enumerable: true, get: function () { return shared_1.dbClientWithoutConnect; } });
const dotenv_1 = __importDefault(require("dotenv"));
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
dotenv_1.default.config();
const redis_1 = require("redis");
const endpoint = `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}`;
const redisClient = (0, redis_1.createClient)({
    url: endpoint
});
exports.redisClient = redisClient;
redisClient.on('error', (err) => console.log('[main]: Redis Client Error', err));
redisClient.connect();
shared_1.dbClientWithoutConnect.use(redisClient).catch((err) => {
    console.log("Redis Client Error", err);
});
const redisPubSubClient = new graphql_redis_subscriptions_1.RedisPubSub({
    connection: endpoint
});
exports.redisPubSubClient = redisPubSubClient;
//# sourceMappingURL=db.js.map