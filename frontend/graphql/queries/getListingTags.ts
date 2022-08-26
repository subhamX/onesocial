import { gql } from "@apollo/client";


export const getListingTags = gql`
    query getListingTags($query: String!) {
        getListingTags(query: $query)
    }
`
