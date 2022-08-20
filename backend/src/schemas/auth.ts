import { gql } from "apollo-server-express";



export const authSchema = gql`

    type UserInstance{
        id: ID!
        name: String!
        email: String!
        avatar_url: String!
        is_google_account_connected: Boolean!
        twitter_user_name: String
    }

    type Query{
        getCurrentUser: UserInstance # returns null if user is not logged in
    }

`
