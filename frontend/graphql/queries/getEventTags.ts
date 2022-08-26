import { gql } from "@apollo/client";


export const getEventTags = gql`
    query getEventTags($query: String!) {
        getEventTags(query: $query)
    }
`
