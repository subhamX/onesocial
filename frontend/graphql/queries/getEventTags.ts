import { gql } from "@apollo/client";


export const getEventTags = gql`
    query($query: String!) {
        getEventTags(query: $query)
    }
`
