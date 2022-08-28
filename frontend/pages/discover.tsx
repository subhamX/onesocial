import { gql, useQuery } from "@apollo/client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { MainSiteNavbar } from "../components/Navbar.tsx/MainSiteNavbar";
import {
  Query,
} from "../graphql/generated_graphql_types";
import { DiscoverListingsController } from "../components/Discover/DiscoverListingsController";
import { DiscoverEventsController } from "../components/Discover/fetchEvents";
import { DiscoverPostsController } from "../components/Discover/fetchPosts";


const getTrendingTags = gql`
  query getTrendingTags {
    getTrendingEventTags
    getTrendingPostsTags
    getTrendingListingTags
  }
`;

const Discover = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const { data: trendingTags } = useQuery<Query>(getTrendingTags);

  let currentTabTags =
    currentTab === 0
      ? trendingTags?.getTrendingEventTags
      : currentTab === 1
        ? trendingTags?.getTrendingPostsTags
        : trendingTags?.getTrendingListingTags;

  const changeTab = (tab: number) => {
    setCurrentTab(tab);
    setTags([]);
  };
  return (
    <>
      <MainSiteNavbar />

      <div className="mx-auto max-w-4xl px-4">
        <div className="text-2xl font-black mt-5 mb-10">Discover</div>

        <div className="border px-2 border-black rounded-none w-full gap-2 my-10 flex">
          <MagnifyingGlassIcon className="w-7" />
          <input
            className="w-full py-3 focus:outline-none"
            placeholder="Search for posts, events, products or services"
            onChange={(e) => {
              if (e.target.value.length !== 1) {
                setQuery(e.target.value);
              }
            }}
          />
        </div>

        <div className="text-sm grid grid-cols-1 sm:grid-cols-10 gap-2 items-center my-5">
          <div className="font-bold col-span-2">Trending tags:</div>
          <div className="flex flex-wrap gap-2 col-span-8">
            {currentTabTags ? (
              currentTabTags.map((currentTag, indx) => {
                const isActive =
                  tags.findIndex((tag) => tag === currentTag) > -1;
                return (
                  <div
                    key={indx}
                    className={`border border-black rounded-3xl min-w-[100px] text-center px-3 py-1 cursor-pointer ${isActive
                        ? "bg-secondary text-secondary-content"
                        : "bg-gray-100"
                      }`}
                    onClick={() => {
                      if (isActive) {
                        setTags(tags.filter((tag) => tag !== currentTag));
                      } else {
                        setTags([...tags, currentTag]);
                      }
                    }}
                  >
                    {currentTag}
                  </div>
                );
              })
            ) : (
              <div className="border border-black rounded-3xl px-3 py-1 bg-gray-300 min-w-[100px] text-center">
                Loading...
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col mt-4 items-center xs:flex-row justify-center gap-3 tabs tabs-boxed bg-base-100">
          <a
            className={`tab w-full xs:w-fit ${currentTab == 0 && "tab-active"}`}
            onClick={() => changeTab(0)}
          >
            Posts
          </a>
          <a
            className={`tab w-full xs:w-fit ${currentTab == 1 && "tab-active"}`}
            onClick={() => changeTab(1)}
          >
            Events
          </a>
          <a
            className={`tab w-full xs:w-fit ${currentTab == 2 && "tab-active"}`}
            onClick={() => changeTab(2)}
          >
            Products &amp; Services
          </a>
        </div>

        {currentTab == 0 && (
          <DiscoverPostsController query={query} tags={tags} />
        )}
        {currentTab == 1 && (
          <DiscoverEventsController query={query} tags={tags} />
        )}
        {currentTab == 2 && (
          <DiscoverListingsController query={query} tags={tags} />
        )}
      </div>
    </>
  );
};

export default Discover;


