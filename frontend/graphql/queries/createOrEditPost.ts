import { gql } from "@apollo/client";


export const createOrEditPost = gql`

mutation($payload: CreateOrEditPostInput!) {
  createOrEditPost(payload: $payload) {
    approx_read_time_in_minutes
    cover_image_url
    comments {
      comment
      comment_id
      posted_by {
        avatar_url
        name
        user_id
      }
    }
    published_on
    title
    show_in_discover
    published_on
    post_id
    number_of_comments
    liked_by_count
    desc_mini
    creator_id
    desc_full_markdown
    creator_info {
      avatar_url
      name
      user_id
    }
    tags
  }
}
`
