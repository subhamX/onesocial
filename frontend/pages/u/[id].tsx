import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { Loading } from "../../components/Commons/Loading";
import { MainSiteNavbar } from "../../components/Navbar.tsx/MainSiteNavbar";
import { UserProfileSiteLogo } from "../../components/Navbar.tsx/UserProfileSiteLogo";
import { EventsComponent } from "../../components/Profile/Events";
import { Posts } from "../../components/Profile/Posts";
import { ProductsAndServices } from "../../components/Profile/ProductsAndServices";
import {
  Mutation,
  MutationToggleFollowAUserArgs,
  Query,
  QueryGetUserInfoByWallIdArgs,
} from "../../graphql/generated_graphql_types";
import { GET_CURRENT_USER } from "../../graphql/queries/getCurrentUser";
import { getErrorMessageFromApolloError } from "../../utils/getErrorMessageFromApolloError";

// fetch user data from server
const getUserInfoByWallId_isCurrentUserASubscriber = gql`
  query getUserInfoByWallId_isCurrentUserASubscriber($wall_id: String!) {
    getUserInfoByWallId(wall_id: $wall_id) {
      avatar_url
      name
      tagline
      user_id
    }
    isCurrentUserASubscriber(wall_id: $wall_id)
  }
`;

const toggleFollowAUser = gql`
  mutation toggleFollowAUser($wall_id: String!) {
    toggleFollowAUser(wall_id: $wall_id)
  }
`;

/*
TODO: 

<ul>
    <li>Add cover banner</li>
    <li>Add testimonials section maybe? Nah. lets leave it. content will move a lot</li>
    <li>Have a nice animation to move the content from left to right, and the new content repalcing it.</li>
    <li>Events will be w-full, and so is posts; Products and service will be grid?</li>
    <li>Search functionality user wise, and global wise</li>

    <li>For a product you can add multiple images.</li>
</ul>
*/

/*
TODO: CASES
1. User not logged in. -> show subscribe now, and make it as SignIn
2. user logged in and on his/her same page -> show 
3. user logged in and on other page -> show subscribe now
*/
const UserProfile = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const router = useRouter();
  const userId = router.query.id as string;

  const { data: userData, loading } = useQuery<
    Query,
    QueryGetUserInfoByWallIdArgs
  >(getUserInfoByWallId_isCurrentUserASubscriber, {
    variables: {
      wall_id: userId,
    },
    skip: !userId,
    onError(error) {
      toast.error(getErrorMessageFromApolloError(error));
      router.push("/");
    },
  });

  const { data: currentUser } = useQuery<Query>(GET_CURRENT_USER);

  const [mutateFn] = useMutation<
    Mutation["toggleFollowAUser"],
    MutationToggleFollowAUserArgs
  >(toggleFollowAUser);

  if (!userData || !userData.getUserInfoByWallId) return null; // I need to do this because navbar isn't ready right now;

  const isCurrentProfileOfLoggedInUser = (currentUser?.getCurrentUser?.id === userId);

  return (
    <>
      <MainSiteNavbar
        leadingBlock={
          <UserProfileSiteLogo
            avatar_url={userData.getUserInfoByWallId.avatar_url ?? ""}
            siteTitle={userData.getUserInfoByWallId.name ?? ""}
          />
        }
      />

      <div className="">
        <div className="bg-red-50 py-10">
          <div className="max-w-3xl mx-auto w-full px-4">
            <div className="text-3xl font-light">
              {userData.getUserInfoByWallId.tagline}
            </div>
            {!isCurrentProfileOfLoggedInUser &&
              <div className="mt-2 flex justify-end">
                <button
                  className="btn btn-accent"
                  onClick={() => {
                    mutateFn({
                      variables: {
                        wall_id: userId,
                      },
                      refetchQueries: [
                        {
                          query: getUserInfoByWallId_isCurrentUserASubscriber,
                          variables: { wall_id: userId },
                        },
                      ],
                      onCompleted(newFollowStatus) {
                        if (newFollowStatus) {
                          toast.success("You are now subscribed to this user");
                        } else {
                          toast.success(
                            "You are now unsubscribed from this user"
                          );
                        }
                      },
                      onError(error) {
                        toast(getErrorMessageFromApolloError(error), {
                          type: "error",
                        });
                      },
                    });
                  }}
                >

                  <>
                    {userData.isCurrentUserASubscriber
                      ? "Subscribed 🎉"
                      : "Subscribe now"}
                  </>
                </button>
              </div>
            }

          </div>
        </div>

        <div className="border-b mb-4 border-black" />

        <div className="flex flex-col items-center xs:flex-row justify-center gap-3 tabs tabs-boxed bg-base-100">
          <a
            className={`tab ${currentTab == 0 && "tab-active"}`}
            onClick={() => setCurrentTab(0)}
          >
            Posts
          </a>
          <a
            className={`tab ${currentTab == 1 && "tab-active"}`}
            onClick={() => setCurrentTab(1)}
          >
            Events
          </a>
          <a
            className={`tab ${currentTab == 2 && "tab-active"}`}
            onClick={() => setCurrentTab(2)}
          >
            Products &amp; Services
          </a>
        </div>

        {currentTab === 0 && <Posts userId={userId} />}
        {currentTab === 1 && <EventsComponent userId={userId} />}
        {currentTab === 2 && <ProductsAndServices />}
      </div>
    </>
  );
};

export default UserProfile;
