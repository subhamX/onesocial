import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { createClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from "@apollo/client/utilities";


const windowDefined = typeof window !== "undefined";


const wsLink = windowDefined ? new GraphQLWsLink(createClient({
  url: 'ws://localhost/ms/chat/graphql-ws',
})) : null;

const httpLink = new HttpLink({
  uri: '/ms/impact/graphql',
});


const splitLink = windowDefined && wsLink ? split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
) : httpLink;

export const apolloClient = new ApolloClient({
  link: splitLink,
  connectToDevTools: true,
  ssrMode: false,
  cache: new InMemoryCache({
    typePolicies: {
      Post: {
        keyFields: ["post_id", "creator_id"],
      },
      Event: {
        keyFields: ["event_id", "organizer_id"],
      },
      PostComment: {
        keyFields: ["comment_id", "post_id"],
      },
      AuthUserPostState: {
        keyFields: ["post_id"],
      },
      Query: {
        // The following are to support fetchMore function
        fields: {
          getPostComments: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs: ["comment_id", "post_id"],

            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing = [], incoming) {
              return [...incoming, ...existing];
            },
          },
          getPostsInWall: {
            keyArgs: ["creator_id", "post_id", "wall_id"],

            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          getEventsInWall: {
            keyArgs: ["event_id", "organizer_id", "wall_id"],

            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          getListingsInWall: {
            keyArgs: ["id", "author_id", "wall_id"],

            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          fetchPosts: {
            // THIS IS GOLD. 🙏
            keyArgs: ["post_id", "creator_id", "payload", ["query", "tags"]],

            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          fetchEvents: {
            keyArgs: ["event_id", "organizer_id", "payload", ["query", "tags"]],

            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          fetchListings: {
            keyArgs: ["id", "author_id", "payload", ["query", "tags"]],

            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },

          getMyFollowings: {
            keyArgs: ["user_id"],
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  credentials: "include",
});
