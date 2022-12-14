import { Entity, Schema } from "redis-om";
import { dbClientWithoutConnect } from ".";

export interface UserModel {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  is_google_account_connected: boolean;
  twitter_user_name: string;
  registered_at: Date;
  last_token_generated_at: Date;
  tagline: string;
}

export class UserModel extends Entity {}

export const userModelSchema = new Schema(
  UserModel,
  {
    id: { type: "string", indexed: true },
    name: { type: "string" },
    email: { type: "string", indexed: true },
    avatar_url: { type: "string" },
    is_google_account_connected: { type: "boolean" },
    twitter_user_name: { type: "string" },
    registered_at: { type: "date" },
    last_token_generated_at: { type: "date" },
    tagline: { type: "string" },
  },
  {
    dataStructure: "JSON",
    indexedDefault: true,
  }
);
