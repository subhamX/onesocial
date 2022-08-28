import { Entity, Schema } from "redis-om";

export interface ChatModel {
    buy_instance_id: string,
    sent_at: string, // although it's date
    message: string,
    seen_by: string[],
    sent_by: string; // id
    sent_by_user_avatar: string;
    sent_by_user_name: string;
}

export class ChatModel extends Entity {}

export const chatModelSchema = new Schema(
  ChatModel,
  {
    buy_instance_id: { type: "string", indexed: true },
    sent_at: {type: "date", sortable: true},
    message: { type: "string"},

    seen_by: { type: "string[]", indexed: true },
    sent_by: { type: "string", indexed: true },
    sent_by_user_avatar: { type: "string" },
    sent_by_user_name: { type: "string" },
  },
  {
    dataStructure: "JSON",
    indexedDefault: true,
  }
);
