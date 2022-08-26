import { gql } from "@apollo/client";


export const getPostTags = gql`
    query getPostTags($query: String!) {
        getPostTags(query: $query)
    }
`
