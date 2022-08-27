import { jwtUserPayloadType } from "@onesocial/shared";

export type ApolloContext = {
  user: null | jwtUserPayloadType;
};
