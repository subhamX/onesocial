import { gql } from "@apollo/client";


export const GET_CURRENT_USER=gql`
    query {
        getCurrentUser {
            id
            avatar_url
            email
            is_google_account_connected
            name
            twitter_user_name
        }
    }
`
