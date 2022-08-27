import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerBase,
} from "apollo-server-core";
import { mergedResolvers } from "./resolvers";
import { mergedTypeDefs } from "./schemas";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { ApolloContext } from "./types/ApolloContext";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import http from "http";
import { parseCookiesToObject } from "./utils/parseCookies";
import authRestRoutes from "./routes/auth";
import storageRestRoutes from "./routes/storage";
import paymentRestRoutes from "./routes/payments";

dotenv.config();

async function startApolloServer() {
  const app = Express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({
        embed: true,
        includeCookies: true,
      }),
    ],

    context: ({ req, res }): ApolloContext | void => {
      const cookieObj = parseCookiesToObject(req.headers.cookie ?? "");

      const authCookie = cookieObj["oneSocialKeeper"];

      if (authCookie) {
        try {
          // decode it etc
          const secret = process.env.JSON_WEB_TOKEN_SECRET ?? "";
          const decoded = jsonwebtoken.verify(authCookie, secret);

          return {
            user: decoded as any, // I'm damn sure that it's correct, so this typecast is okay
          };
        } catch (err) {
          return {
            user: null,
          };
        }
      } else {
        return {
          user: null,
        };
      }
    },
  });

  await server.start();

  server.applyMiddleware({ app });

  app.use("/api/auth/", authRestRoutes);
  app.use("/api/storage/", storageRestRoutes);
  app.use("/api/payments/", paymentRestRoutes);

  app.get("*", (req, res) => {
    res.send({
      error: true,
      message: "Route not found",
    });
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}

startApolloServer();
