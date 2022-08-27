import { Entity, Schema } from "redis-om";
import { dbClientWithoutConnect } from ".";

export interface EventTagModel {
  label_aka_value: string;
  is_trending: boolean;
}

export class EventTagModel extends Entity {}

export const eventTagModelSchema = new Schema(
  EventTagModel,
  {
    label_aka_value: { type: "text", indexed: true },
    is_trending: { type: "boolean", indexed: true },
  },
  {
    dataStructure: "JSON",
    indexedDefault: true,
  }
);
