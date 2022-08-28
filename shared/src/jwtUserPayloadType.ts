export type jwtUserPayloadType = {
  id: string;
  email: string;
  name: string;
};



export type ShiApolloContext = {
  user: null | jwtUserPayloadType;
};
