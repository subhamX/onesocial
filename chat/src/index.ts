import {
    ApolloServerPluginDrainHttpServer,
    ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { ApolloServer } from 'apollo-server-express'
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import Express from 'express'
import http from 'http'
import jwt from 'jsonwebtoken'
import { parseCookiesToObject } from '@onesocial/shared'
import dotenv from 'dotenv'
import { typeDefs } from './typeDefs';
import { mergedResolvers } from './resolvers';

dotenv.config()


async function startApolloServer() {

    const app = Express()

    const httpServer = http.createServer(app);

    const schema = makeExecutableSchema({ typeDefs: typeDefs, resolvers: mergedResolvers });

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/ms/chat/graphql-ws',
        verifyClient: (info, cb) => {

            try {
                const cookieObj = parseCookiesToObject(info.req.headers.cookie ?? "");
                const authCookie = cookieObj["oneSocialKeeper"];
                if (!authCookie) throw new Error("No auth cookie")
                // decode it etc
                const secret = process.env.JSON_WEB_TOKEN_SECRET ?? "";
                const decoded = jwt.verify(authCookie, secret);
                // look for ways to pass this decoded value;
                cb(true)
            } catch (err) {
                cb(false)
            }
        }
    });

    const serverCleanup = useServer({ schema }, wsServer);

    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        cache: "bounded",
        plugins: [
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({ httpServer }),

            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
            ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        ],

    });


    await server.start();
    server.applyMiddleware({
        app,
        path: '/ms/chat/graphql',
    });


    await new Promise<void>(resolve => httpServer.listen({ port: 5000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
}

startApolloServer()

