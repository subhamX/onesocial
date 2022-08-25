import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';


console.log(process.env.SERVER_URL)
export const apolloClient = new ApolloClient({
  uri: '/graphql',
  connectToDevTools: true,
  ssrMode: false,
  cache: new InMemoryCache({
    typePolicies: {
      Post: {
        keyFields: ['post_id', 'creator_id']
      },
      Event: {
        keyFields: ['event_id', 'organizer_id']
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
            keyArgs:["comment_id", "post_id"],


            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing = [], incoming) {
              return [...incoming, ...existing];
            },
          },
          getPostsInWall: {
            keyArgs:["creator_id", "post_id"],

            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          getEventsInWall: {
            keyArgs: ['event_id', 'organizer_id'],

            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          getListingsInWall: {
            keyArgs: ['id', 'author_id'],

            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          }
        }
      }
    }
  }),
  credentials: 'include'
});
