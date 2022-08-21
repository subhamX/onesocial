import { gql } from "@apollo/client";



export const getPostInfoById=gql`

query($post_id: String!){
  getPostInfoById(post_id: $post_id) {
    approx_read_time_in_minutes
    cover_image_url
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
  authUserPostState(post_id: $post_id) {
    is_post_liked_by_me
    post_id
  }
}

`
