import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { ProductOrServiceUI } from "../Profile/ProductOrServiceUI";
import { ThatsTheEndInfoAlert } from "../Profile/ThatsTheEndInfoAlert";
import {
  Query,
  QueryFetchPostsArgs
} from "../../graphql/generated_graphql_types";
import { limit } from "./fetchPosts";
import { DiscoverLoading } from "./DiscoverLoading";

const fetchListings = gql`
  query fetchListings($payload: QueryEntityInput!) {
    fetchListings(payload: $payload) {
      author_id
      name
      listing_type
      author {
        avatar_url
        name
        tagline
        user_id
      }
      currency
      price
      id
      reviews_score
      number_of_reviews
      cover_image_url
    }
  }
`;


export const DiscoverListingsController = ({
  query, tags,
}: {
  query: string;
  tags: string[];
}) => {
  const [hasMore, setHasMore] = useState(true);

  const [fetchHandler, { data, loading, fetchMore, error }] = useLazyQuery<
    Query,
    QueryFetchPostsArgs
  >(fetchListings, {
    onCompleted(data) {
      if (data.fetchListings.length < limit) {
        setHasMore(false);
      }
    },
  });

  useEffect(() => {
    setHasMore(true);
    fetchHandler({
      variables: {
        payload: {
          limit,
          offset: 0,
          query,
          tags,
        },
      },
    });
  }, [fetchHandler, query, tags]);

  return (
    <div>
      {loading && <DiscoverLoading />}

      <div className="mt-5"></div>
      {error && <div className="alert alert-error">{error.message}</div>}
      {data?.fetchListings && data.fetchListings.length !== 0 && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            {data?.fetchListings.map((listing, indx) => (
              <ProductOrServiceUI key={indx} listingInstance={listing} />
            ))}
          </div>

          <div className="mb-10">
            {hasMore ? (
              <button
                className="btn btn-primary"
                onClick={() => {
                  fetchMore({
                    variables: {
                      payload: {
                        limit,
                        offset: data?.fetchListings.length,
                        query,
                        tags,
                      },
                    },
                  }).then((e) => {
                    if (e.data.fetchListings.length < limit)
                      setHasMore(false);
                  });
                }}
              >
                Load more...
              </button>
            ) : (
              <ThatsTheEndInfoAlert />

            )}
          </div>
        </>
      )}

      {data?.fetchListings.length === 0 && (
        <div className="alert max-w-3xl my-2 mx-auto bg-gradient-to-r from-sky-300 to-cyan-300">
          Sorry! There&apos;re no events for the specified query!
        </div>
      )}
    </div>
  );
};
