"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_core_1 = require("apollo-server-core");
const apollo_server_express_1 = require("apollo-server-express");
const schema_1 = require("@graphql-tools/schema");
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const shared_1 = require("@onesocial/shared");
const dotenv_1 = __importDefault(require("dotenv"));
const typeDefs_1 = require("./typeDefs");
const resolvers_1 = require("./resolvers");
dotenv_1.default.config();
async function startApolloServer() {
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    const schema = (0, schema_1.makeExecutableSchema)({ typeDefs: typeDefs_1.typeDefs, resolvers: resolvers_1.mergedResolvers });
    const wsServer = new ws_1.WebSocketServer({
        server: httpServer,
        path: '/ms/chat/graphql-ws',
        verifyClient: (info, cb) => {
            var _a, _b;
            try {
                const cookieObj = (0, shared_1.parseCookiesToObject)((_a = info.req.headers.cookie) !== null && _a !== void 0 ? _a : "");
                const authCookie = cookieObj["oneSocialKeeper"];
                if (!authCookie)
                    throw new Error("No auth cookie");
                const secret = (_b = process.env.JSON_WEB_TOKEN_SECRET) !== null && _b !== void 0 ? _b : "";
                const decoded = jsonwebtoken_1.default.verify(authCookie, secret);
                cb(true);
            }
            catch (err) {
                cb(false);
            }
        }
    });
    const serverCleanup = (0, ws_2.useServer)({ schema }, wsServer);
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        csrfPrevention: true,
        cache: "bounded",
        plugins: [
            (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
            (0, apollo_server_core_1.ApolloServerPluginLandingPageLocalDefault)({ embed: true }),
        ],
    });
    await server.start();
    server.applyMiddleware({
        app,
        path: '/ms/chat/graphql',
    });
    await new Promise(resolve => httpServer.listen({ port: 5000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
}
startApolloServer();
//# sourceMappingURL=index.js.map