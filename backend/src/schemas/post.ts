import { gql } from "apollo-server-express";

export const postSchema = gql`
  type Post {
    post_id: ID!
    creator_id: String!
    creator_info: UserPublicInfo!

    title: String!
    desc_mini: String! # to be used by post tiles
    desc_full_markdown: String!
    cover_image_url: String!

    liked_by_count: Int!
    published_on: String!
    number_of_comments: Int!
    approx_read_time_in_minutes: Int!

    show_in_discover: Boolean!

    comments: [PostComment]!
  }

  type PostComment {
    comment_id: ID!
    comment: String!
    posted_by: UserPublicInfo!
  }

  type AuthUserPostState {
    # No need of ID? But caching might be difficult so adding one
    post_id: ID!
    is_post_liked_by_me: Boolean!
  }
`;
