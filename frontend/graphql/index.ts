import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';


console.log(process.env.SERVER_URL)
export const apolloClient = new ApolloClient({
    uri: '/graphql',
    cache: new InMemoryCache(),
    credentials: 'include'
});
