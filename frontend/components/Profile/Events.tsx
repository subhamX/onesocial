import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import { gql, useQuery } from "@apollo/client";
import {
  Query,
  QueryGetEventsInWallArgs,
} from "../../graphql/generated_graphql_types";
import { useState } from "react";
import { Loading } from "../Commons/Loading";
import { EventUI } from "./EventUI";
import { ThatsTheEndInfoAlert } from "./ThatsTheEndInfoAlert";

dayjs.extend(duration);
dayjs.extend(relativeTime);

const getEventsInWall = gql`
  query ($offset: Int!, $limit: Int!, $wall_id: String!) {
    getEventsInWall(offset: $offset, limit: $limit, wall_id: $wall_id) {
      cover_image_url
      duration_in_minutes
      event_id
      event_start_time
      number_of_registrations
      show_in_discover
      tags
      title
      organizer_id
      is_member_only_event
    }
  }
`;

export const EventsComponent = ({ userId }: { userId: string }) => {
  const [hasMore, setHasMore] = useState(true);

  const {
    data,
    fetchMore,
    loading: isEventsLoading,
  } = useQuery<Query, QueryGetEventsInWallArgs>(getEventsInWall, {
    variables: {
      offset: 0,
      limit: 10,
      wall_id: userId,
    },
    skip: !userId,
    fetchPolicy: "no-cache",
    nextFetchPolicy: "cache-first",
    onCompleted(data) {
      if (data.getEventsInWall.length < 2) setHasMore(false);
    },
  });

  const events = data?.getEventsInWall ?? [];

  return (
    <div className="max-w-4xl  mx-auto px-4">
      {isEventsLoading && !data?.getEventsInWall && (
        <Loading text="Crunching latest events... ⟨䷄⟩" />
      )}
      {data?.getEventsInWall?.length === 0 && (
        <div className="alert max-w-3xl my-2 mx-auto bg-gradient-to-r from-sky-300 to-cyan-300">
          No events yet!
        </div>
      )}

      {data?.getEventsInWall && !!events.length && (
        <div className="my-3">
          {events.map((e, indx) => (
            <EventUI key={indx} event={e} />
          ))}

          <div className="mb-10 mt-5">
            {hasMore ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={() =>
                  fetchMore({
                    variables: {
                      offset: events.length,
                      limit: 10,
                      wall_id: userId,
                    },
                  }).then((e) => {
                    if (e.data.getEventsInWall.length < 10) setHasMore(false);
                  })
                }
              >
                Load more...
              </button>
            ) : (
              <ThatsTheEndInfoAlert/>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const Calender = ({
  date,
  month,
  className,
}: {
  date: string;
  month: string;
  className: string;
}) => (
  <div
    className={
      "w-20 h-fit flex flex-col p-0 border rounded-lg overflow-hidden text-center " +
      className
    }
  >
    <div className="bg-gray-800 w-full flex justify-center items-center font-medium h-8 text-white">
      {month}
    </div>
    <div className="bg-gray-200 h-8 w-full flex justify-center items-center">
      {date}
    </div>
  </div>
);



