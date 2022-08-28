import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { Loading } from "../../../components/Commons/Loading";
import { MainSiteNavbar } from "../../../components/Navbar.tsx/MainSiteNavbar";
import { UserAvatar } from "../../../components/Profile/UserAvatar";
import { DETAILED_LISTING } from "../../../config/ScreenRoutes";
import {
  Query,
  QueryGetListingsBoughtArgs,
} from "../../../graphql/generated_graphql_types";

const getListingsBought = gql`
  query getListingsBought($offset: Int!, $limit: Int!) {
    getListingsBought(offset: $offset, limit: $limit) {
      author {
        avatar_url
        name
        tagline
        user_id
      }
      name
      price
      buy_instance_id
      id
    }
  }
`;

// TODO: THis does not work
const ListingBoughtByUser = () => {
  const { data, loading } = useQuery<Query, QueryGetListingsBoughtArgs>(
    getListingsBought,
    {
      variables: {
        // TODO: we need to fix this pagination later?
        limit: 100,
        offset: 0,
      },
    }
  );
  alert("Not implemented yet");
  return (
    <div>
      <MainSiteNavbar />

      <div className="max-w-2xl mx-auto px-4">
        <div className="text-2xl font-black my-5 mb-6">
          Products and services bought
        </div>

        {loading && <Loading text="Crunching latest data..." />}

        {data?.getListingsBought && data?.getListingsBought.length === 0 && (
          <div className="alert max-w-3xl my-2 mx-auto bg-gradient-to-r from-sky-300 to-cyan-300">
            You have not bought any listings yet!
          </div>
        )}

        {data?.getListingsBought &&
          !!data?.getListingsBought.length &&
          data?.getListingsBought.map((e, indx) => (
            <Link key={indx} href={DETAILED_LISTING(e.listing_type, e.id)}>
              <div className="flex gap-4 cursor-pointer border border-gray-500 bg-gray-100 py-3 px-2 my-4 hover:bg-gray-200">
                <div className="avatar flex items-center">
                  <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src="https://placeimg.com/192/192/tech" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-base font-bold">{e.name}</div>
                  <div className="text-sm text-gray-500">Price: {e.price}</div>

                  <div className="text-xs flex gap-1 items-center text-gray-400">
                    <div>Product By:</div>{" "}
                    <UserAvatar
                      user={e.author}
                      avatarClassName="w-5"
                      textClassName="text-xs text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default ListingBoughtByUser;
