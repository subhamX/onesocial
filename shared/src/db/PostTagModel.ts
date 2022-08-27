import { Entity, Schema } from "redis-om";
import { dbClientWithoutConnect } from ".";

export interface PostTagModel {
  label_aka_value: string;
  is_trending: boolean;
}

export class PostTagModel extends Entity {}

export const postTagModelSchema = new Schema(
  PostTagModel,
  {
    label_aka_value: { type: "text", indexed: true },
    is_trending: { type: "boolean", indexed: true },
  },
  {
    dataStructure: "JSON",
    indexedDefault: true,
  }
);
