import { gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Query, QueryFetchPostsArgs } from "../../graphql/generated_graphql_types";
import { EventUI } from "../Profile/EventUI";
import { ThatsTheEndInfoAlert } from "../Profile/ThatsTheEndInfoAlert";

import { DiscoverLoading } from "./DiscoverLoading";
import { limit } from "./fetchPosts";

const fetchEvents = gql`
  query fetchEvents($payload: QueryEntityInput!) {
    fetchEvents(payload: $payload) {
      cover_image_url
      desc_full_markdown
      title
      tags
      cover_image_url
      event_id
      organizer_id
      tags
      event_start_time
      duration_in_minutes
      number_of_registrations
    }
  }
`;
export const DiscoverEventsController = ({
  query, tags,
}: {
  query: string;
  tags: string[];
}) => {
  const [hasMore, setHasMore] = useState(true);

  const [fetchHandler, { data, loading, fetchMore, error }] = useLazyQuery<
    Query,
    QueryFetchPostsArgs
  >(fetchEvents, {
    onCompleted(data) {
      if (data.fetchEvents.length < limit) {
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
      {data?.fetchEvents && data.fetchEvents.length !== 0 && (
        <>
          {data?.fetchEvents.map((event, indx) => (
            <EventUI key={indx} event={event} />
          ))}

          <div className="mb-10 mt-5">
            {hasMore ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  fetchMore({
                    variables: {
                      payload: {
                        limit,
                        offset: data?.fetchEvents.length,
                        query,
                        tags,
                      },
                    },
                  }).then((e) => {
                    if (e.data.fetchEvents.length < limit)
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

      {data?.fetchEvents.length === 0 && (
        <div className="alert max-w-3xl my-2 mx-auto bg-gradient-to-r from-sky-300 to-cyan-300">
          Sorry! There are no upcoming events for the specified query! 😭
        </div>
      )}
    </div>
  );
};
