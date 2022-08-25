import { gql } from "@apollo/client";


export const getListingTags = gql`
    query($query: String!) {
        getListingTags(query: $query)
    }
`
