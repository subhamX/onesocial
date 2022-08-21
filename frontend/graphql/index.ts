import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';


console.log(process.env.SERVER_URL)
export const apolloClient = new ApolloClient({
  uri: '/graphql',
  connectToDevTools: true,
  ssrMode: false,
  cache: new InMemoryCache({
    typePolicies: {
      Post: {
        keyFields: ['post_id']
      },
      PostComment: {
        keyFields: ["comment_id", "post_id"],
      },
      AuthUserPostState: {
        keyFields: ["post_id"],
      },
      Query: {
        fields: {
          getPostComments: {
            // Don't cache separate results based on
            // any of this field's arguments.
            keyArgs:["comment_id", "post_id"],


            // Concatenate the incoming list items with
            // the existing list items.
            merge(existing = [], incoming) {
              // console.log(existing, incoming)
              return [...incoming, ...existing];
            },
          }
        }
      }
    }
  }),
  credentials: 'include'
});
