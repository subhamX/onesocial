import { Entity, Schema } from "redis-om";
import { dbClient } from ".";

interface PostTagModel {
  label_aka_value: string;
  is_trending: boolean;
}

class PostTagModel extends Entity {}

const postTagModelSchema = new Schema(
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

export const postTagModelRepository =
  dbClient.fetchRepository(postTagModelSchema);

postTagModelRepository.createIndex();
