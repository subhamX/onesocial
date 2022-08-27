import { Entity, Schema } from "redis-om";
import { dbClientWithoutConnect } from ".";

export interface PotentialUserModel {
  name: string;
  email: string;
  avatar_url: string;
  is_google_account_connected: boolean;
  twitter_user_name: string;
}

export class PotentialUserModel extends Entity {}

export const potentialUserModelSchema = new Schema(
  PotentialUserModel,
  {
    name: { type: "string" },
    email: { type: "string", indexed: true },
    avatar_url: { type: "string" },
    is_google_account_connected: { type: "boolean" },
    twitter_user_name: { type: "string" },
  },
  {
    dataStructure: "JSON",
    indexedDefault: true,
  }
);
