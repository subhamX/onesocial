import { gql } from "@apollo/client";


export const getPostTags = gql`
    query($query: String!) {
        getPostTags(query: $query)
    }
`
