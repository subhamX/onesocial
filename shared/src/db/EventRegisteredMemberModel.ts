import { Entity, Schema } from "redis-om";
import { dbClient } from ".";

export interface EventRegisteredMemberModel {
  registered_at: string;
  event_id: string;
  member_wall_id: string;
}

export class EventRegisteredMemberModel extends Entity {}

const eventRegisteredMemberModelSchema = new Schema(
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

export const eventRegisteredMemberModelRepository = dbClient.fetchRepository(
  eventRegisteredMemberModelSchema
);

eventRegisteredMemberModelRepository.createIndex();
