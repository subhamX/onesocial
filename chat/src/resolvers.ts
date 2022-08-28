import { redisPubSubClient } from "./db";
import { withFilter } from "graphql-subscriptions";


export const mergedResolvers = {
    Subscription: {
        fetchNewMessageOfSession: {
            subscribe: withFilter(
                (rootVal, args, context) => {
                    return redisPubSubClient.asyncIterator('NEW_MESSAGE')
                },
                (payload, variables, context) => {
                    if(variables.buy_instance_id === payload.fetchNewMessageOfSession.buy_instance_id){
                        return true;
                    }else{
                        return false;
                    }
                }
            ),
        }
    }
}
