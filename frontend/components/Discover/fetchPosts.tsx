import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Query, QueryFetchPostsArgs } from "../../graphql/generated_graphql_types";
import { PostUI } from "../Profile/PostUI";
import { ThatsTheEndInfoAlert } from "../Profile/ThatsTheEndInfoAlert";

import { DiscoverLoading } from "./DiscoverLoading";


export const fetchPosts = gql`
  query fetchPosts($payload: QueryEntityInput!) {
    fetchPosts(payload: $payload) {
      approx_read_time_in_minutes
      tags
      title
      approx_read_time_in_minutes
      show_in_discover
      published_on
      number_of_comments
      liked_by_count
      desc_mini
      post_id
      creator_id
      cover_image_url
      creator_info {
        avatar_url
        name
        user_id
      }
    }
  }
`;

export const limit = 10;
export const DiscoverPostsController = ({
  query, tags,
}: {
  query: string;
  tags: string[];
}) => {
  const [hasMore, setHasMore] = useState(true);

  const [fetchHandler, { data, loading, fetchMore, error }] = useLazyQuery<
    Query,
    QueryFetchPostsArgs
  >(fetchPosts, {
    onCompleted(data) {
      if (data.fetchPosts.length < limit) {
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
      {(loading || !data) && <DiscoverLoading />}

      <div className="mt-5"></div>
      {error && <div className="alert alert-error">{error.message}</div>}
      {data?.fetchPosts && data.fetchPosts.length !== 0 && (
        <>
          {data?.fetchPosts.map((post, indx) => (
            <PostUI key={indx} post={post} />
          ))}

          <div className="mb-10">
            {hasMore ? (
              <button
                className="btn btn-primary"
                onClick={() => {
                  fetchMore({
                    variables: {
                      payload: {
                        limit,
                        offset: data?.fetchPosts.length,
                        query,
                        tags,
                      },
                    },
                  }).then((e) => {
                    if (e.data.fetchPosts.length < limit)
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

      {data?.fetchPosts.length === 0 && (
        <div className="alert max-w-3xl my-2 mx-auto bg-gradient-to-r from-sky-300 to-cyan-300">
          Sorry! There're no listings for the specified query!
        </div>
      )}
    </div>
  );
};
