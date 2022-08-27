import { Entity, Schema } from "redis-om";
import { dbClientWithoutConnect } from ".";

export interface PostCommentModel {
  comment: string;
  posted_by_user_id: string;
  commented_at: string;
  post_id: string;
}

export class PostCommentModel extends Entity {}

// the reason why we're not embedding it, because a post can have hundreds of comments
// and the reason why we're not embedding [posted_by] because nodejs OM doesn't support it yet. Ideally we should've deNormalized it here
export const postCommentModelSchema = new Schema(
  PostCommentModel,
  {
    post_id: { type: "string", indexed: true }, // to get all comments by post;
    comment: { type: "string" },
    posted_by_user_id: { type: "string" },
    commented_at: { type: "date", sortable: true },
  },
  {
    dataStructure: "JSON",
    indexedDefault: true,
  }
);
