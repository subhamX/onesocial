export type jwtUserPayloadType = {
    id: string;
    email: string;
    name: string;
  };

export type ApolloContext = {
    user: null | jwtUserPayloadType
}
