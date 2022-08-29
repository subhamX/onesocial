"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergedResolvers = void 0;
const db_1 = require("./db");
const graphql_subscriptions_1 = require("graphql-subscriptions");
exports.mergedResolvers = {
    Subscription: {
        fetchNewMessageOfSession: {
            subscribe: (0, graphql_subscriptions_1.withFilter)((rootVal, args, context) => {
                return db_1.redisPubSubClient.asyncIterator('NEW_MESSAGE');
            }, (payload, variables, context) => {
                if (variables.buy_instance_id === payload.fetchNewMessageOfSession.buy_instance_id) {
                    return true;
                }
                else {
                    return false;
                }
            }),
        }
    }
};
//# sourceMappingURL=resolvers.js.map