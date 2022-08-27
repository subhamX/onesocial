import { Entity, Schema } from "redis-om";
import { dbClientWithoutConnect } from ".";

export interface EventRegisteredMemberModel {
  registered_at: string;
  event_id: string;
  member_wall_id: string;
}

export class EventRegisteredMemberModel extends Entity {}

export const eventRegisteredMemberModelSchema = new Schema(
  EventRegisteredMemberModel,
  {
    registered_at: { type: "text" },
    event_id: { type: "string", indexed: true },
    member_wall_id: { type: "string", indexed: true },
  },
  {
    dataStructure: "JSON",
    indexedDefault: true,
  }
);
