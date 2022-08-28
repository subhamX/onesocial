import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";
import { Loading } from "../components/Commons/Loading";
import { MainSiteNavbar } from "../components/Navbar.tsx/MainSiteNavbar";
import { ThatsTheEndInfoAlert } from "../components/Profile/ThatsTheEndInfoAlert";
import { UserAvatar } from "../components/Profile/UserAvatar";
import { DETAILED_LISTING, USER_WALL_SCREEN } from "../config/ScreenRoutes";
import {
  Query,
  QueryGetAllCustomersArgs,
  QueryGetMyFollowersArgs,
} from "../graphql/generated_graphql_types";

const getAllCustomers = gql`
  query ($offset: Int!, $limit: Int!) {
    getAllCustomers(offset: $offset, limit: $limit) {
      listing_id
      buyer {
        avatar_url
        name
        user_id
      }
      listing {
        name
        price
        listing_type
      }
    }
  }
`;

const Followers = () => {
  const [hasMore, setHasMore] = useState(true);

  const { loading, data, fetchMore } = useQuery<
    Query,
    QueryGetAllCustomersArgs
  >(getAllCustomers, {
    variables: {
      // TODO: we need to define merge to be able to use fetchMore; just as a fix, having limit=100
      limit: 100,
      offset: 0,
    },
    fetchPolicy: "no-cache",
    nextFetchPolicy: "cache-first",
  });

  return (
    <div>
      <MainSiteNavbar />

      <div className="max-w-2xl mx-auto px-4 mt-5">
        <div className="text-2xl font-black mb-6">My customers</div>

        {loading && <Loading text="Crunching latest followings..." />}

        {data?.getAllCustomers && data?.getAllCustomers.length === 0 && (
          <div className="alert max-w-3xl my-2 mx-auto bg-gradient-to-r from-sky-300 to-cyan-300">
            You currently don&apos;t have any customers! 😢
          </div>
        )}

        {data?.getAllCustomers && data?.getAllCustomers.length !== 0 && (
          <div className="max-w-xl mx-auto">
            {data?.getAllCustomers &&
              !!data?.getAllCustomers.length &&
              data?.getAllCustomers.map((e, indx) => (
                <Link
                  key={indx}
                  href={DETAILED_LISTING(e.listing.listing_type, e.listing_id)}
                >
                  <div className="grid grid-cols-2 gap-1 cursor-pointer border border-gray-500 bg-gray-100 py-3 px-2 my-4 hover:bg-gray-200">
                    <div>Product:</div>
                    <div className="font-black">{e.listing.name}</div>

                    <div className="text-sm">Price:</div>
                    <div className="font-bold text-sm">{e.listing.price}</div>

                    <div className="text-sm">Bought By:</div>
                    <UserAvatar
                      user={e.buyer}
                      textClassName="font-bold text-sm"
                    />
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
                          offset: data?.getAllCustomers.length,
                          limit: 10,
                        },
                      }).then((e) => {
                        if (e.data.getAllCustomers.length < 10)
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
