"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_core_1 = require("apollo-server-core");
exports.typeDefs = (0, apollo_server_core_1.gql) `
    type Query{
        dummy(message: String!): String
    }

    type Message{
        buy_instance_id: String!
        sent_at: Float!
        message: String!
        seen_by: [String!]!
        sent_by: String!
        sent_by_user_avatar: String!
        sent_by_user_name: String!
    }

    type Subscription{
        # chat subscription
        # ensure that we allow chat subscription only in certain cases;
        fetchNewMessageOfSession(buy_instance_id: String!): Message!
    }

`;
//# sourceMappingURL=typeDefs.js.map