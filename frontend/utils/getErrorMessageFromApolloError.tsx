import { ApolloError } from "@apollo/client";

export const getErrorMessageFromApolloError = (err: ApolloError) => {
  if (err.clientErrors?.[0]?.message) {
    return err.clientErrors?.[0]?.message;
  } else if (err.graphQLErrors?.[0]?.message) {
    return err.graphQLErrors?.[0]?.message;
  } else {
    return err.message;
  }
};
