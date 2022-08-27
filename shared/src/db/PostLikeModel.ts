import { Entity, Schema } from "redis-om";
import { dbClient } from ".";

export interface PostLikeModel {
  user_id: string;
  liked_at: string;
  post_id: string;
}

export class PostLikeModel extends Entity {}

// the reason why we're not embedding it, because a post can have hundreds of comments
// and the reason why we're not embedding [posted_by] because nodejs OM doesn't support it yet. Ideally we should've deNormalized it here
const postLikeModelSchema = new Schema(
  PostLikeModel,
  {
    user_id: { type: "string", indexed: true }, // to get all comments by post;
    post_id: { type: "string", indexed: true },
    liked_at: { type: "date" },
  },
  {
    dataStructure: "JSON",
    indexedDefault: true,
  }
);

export const postLikeModelRepository =
  dbClient.fetchRepository(postLikeModelSchema);

postLikeModelRepository.createIndex();
