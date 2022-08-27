import { Entity, Schema } from "redis-om";
import { dbClientWithoutConnect } from ".";

export interface ListingTagModel {
  label_aka_value: string;
  is_trending: boolean;
}

export class ListingTagModel extends Entity {}

export const ListingModelSchema = new Schema(
  ListingTagModel,
  {
    label_aka_value: { type: "text", indexed: true },
    is_trending: { type: "boolean", indexed: true },
  },
  {
    dataStructure: "JSON",
    indexedDefault: true,
  }
);
