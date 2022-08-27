import { Entity, Schema } from "redis-om";
import { dbClient } from ".";

export interface PostModel {
  creator_id: string;
  title: string;
  desc_full_markdown: string;
  cover_image_url: string;
  liked_by_count: number;
  published_on: string; // It seems to be okay
  number_of_comments: number;
  approx_read_time_in_minutes: number;
  show_in_discover: boolean;
  tags: string[];
}

export class PostModel extends Entity {}

const postModelSchema = new Schema(
  PostModel,
  {
    creator_id: { type: "string", indexed: true }, // to get all posts by user

    title: { type: "text", indexed: true }, // indexed for full text search
    desc_full_markdown: { type: "string" },
    cover_image_url: { type: "string" },

    liked_by_count: { type: "number", sortable: true },
    published_on: { type: "date", sortable: true },
    number_of_comments: { type: "number" },
    approx_read_time_in_minutes: { type: "number" },

    show_in_discover: { type: "boolean", indexed: true }, // to know if we should publish it

    tags: { type: "string[]", indexed: true },
  },
  {
    dataStructure: "JSON",
    indexedDefault: true,
  }
);

export const postModelRepository = dbClient.fetchRepository(postModelSchema);

postModelRepository.createIndex();
