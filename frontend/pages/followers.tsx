import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";
import { Loading } from "../components/Commons/Loading";
import { MainSiteNavbar } from "../components/Navbar.tsx/MainSiteNavbar";
import { ThatsTheEndInfoAlert } from "../components/Profile/ThatsTheEndInfoAlert";
import { USER_WALL_SCREEN } from "../config/ScreenRoutes";
import {
  Query,
  QueryGetMyFollowersArgs,
} from "../graphql/generated_graphql_types";

const getMyFollowers = gql`
  query getMyFollowers($offset: Int!, $limit: Int!) {
    getMyFollowers(offset: $offset, limit: $limit) {
      avatar_url
      name
      tagline
      user_id
    }
  }
`;

const Followers = () => {
  const [hasMore, setHasMore] = useState(true);

  const { loading, data, fetchMore } = useQuery<Query, QueryGetMyFollowersArgs>(
    getMyFollowers,
    {
      variables: {
        limit: 10,
        offset: 0,
      },
      fetchPolicy: "no-cache",
      nextFetchPolicy: "cache-first",
    }
  );

  return (
    <div>
      <MainSiteNavbar />

      <div className="max-w-2xl mx-auto px-4 mt-5">
        <div className="text-2xl font-black mb-6">My followers</div>

        {loading && <Loading text="Crunching latest followings..." />}

        {data?.getMyFollowers && data?.getMyFollowers.length === 0 && (
          <div className="alert max-w-3xl my-2 mx-auto bg-gradient-to-r from-sky-300 to-cyan-300">
            You are not followed by anyone yet!
          </div>
        )}

        {data?.getMyFollowers && data?.getMyFollowers.length !== 0 && (
          <div className="max-w-xl mx-auto">
            {data?.getMyFollowers &&
              !!data?.getMyFollowers.length &&
              data?.getMyFollowers.map((e, indx) => (
                <Link key={indx} href={USER_WALL_SCREEN(e.user_id)}>
                  <div className="card flex-row card-compact my-4 border border-gray-400 bg-gray-50 shadow-xl flex gap-4 cursor-pointer  py-4 px-3 hover:bg-gray-200">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={e.avatar_url} />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="text-sm font-bold">{e.name}</div>
                      <div className="text-xs">{e.tagline}</div>
                    </div>
                  </div>
                </Link>
              ))}

            {hasMore && (
              <div className="mb-10">
                {hasMore ? (
                  <button
                    className="btn btn-sm lowercase btn-primary"
                    onClick={() =>
                      fetchMore({
                        variables: {
                          offset: data?.getMyFollowers.length,
                          limit: 10,
                        },
                      }).then((e) => {
                        if (e.data.getMyFollowers.length < 10)
                          setHasMore(false);
                      })
                    }
                  >
                    Load more...
                  </button>
                ) : (
                  <ThatsTheEndInfoAlert/>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Followers;
