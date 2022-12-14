import { BookOpenIcon, HeartIcon } from "@heroicons/react/24/solid";
import {
  HeartIcon as HeartOutlineIcon,
  ChatBubbleBottomCenterIcon as ChatAltIcon,
} from "@heroicons/react/24/outline";

import { MainSiteNavbar } from "./Navbar.tsx/MainSiteNavbar";
import { UserProfileSiteLogo } from "./Navbar.tsx/UserProfileSiteLogo";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { gql, useMutation, useQuery } from "@apollo/client";
import { getPostInfoById } from "../graphql/queries/getPostInfoById";
import {
  Mutation,
  MutationTogglePostLikeArgs,
  Post,
  Query,
  QueryGetPostInfoByIdArgs,
} from "../graphql/generated_graphql_types";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { getErrorMessageFromApolloError } from "../utils/getErrorMessageFromApolloError";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { PostCommentsComponent } from "./PostCommentsComponent";
import { UserAvatar } from "./Profile/UserAvatar";
import rehypeSanitize from "rehype-sanitize";
import { GET_CURRENT_USER } from "../graphql/queries/getCurrentUser";
import Link from "next/link";
import { EDIT_POST } from "../config/ScreenRoutes";

const Markdown = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

dayjs.extend(relativeTime);

// TODO: fix to client to cache to improve things;
const togglePostLikeGql = gql`
  mutation ($post_id: String!) {
    togglePostLike(post_id: $post_id)
  }
`;

export const PostsDetailedScreen = () => {
  const router = useRouter();
  const postId = router.query.id as string;

  const { data, loading: isPostLoading } = useQuery<
    { getPostInfoById: Post; authUserPostState: Query["authUserPostState"] },
    QueryGetPostInfoByIdArgs
  >(getPostInfoById, {
    variables: {
      post_id: postId as string,
    },
    skip: !postId,
  });

  const [postLikeMutateFunction] = useMutation<
    Mutation["togglePostLike"],
    MutationTogglePostLikeArgs
  >(togglePostLikeGql);

    // fetch user
    const { loading: userDataLoading, data: user } = useQuery<Query>(
      GET_CURRENT_USER,
      {
        fetchPolicy: "cache-first",
      }
    );
  
  const post = data?.getPostInfoById;

  const authUserPostState = data?.authUserPostState;

  const togglePostLike = () => {
    // TODO: Graphql logic to toggle like
    // If the user is not logged in then put an alert to login

    if (!authUserPostState) {
      if(typeof window !=='undefined') alert("Please login to ?????? the post.");
      return;
    } else {
      // toggle like
      // togglePostLike
      postLikeMutateFunction({
        variables: {
          post_id: postId,
        },
        refetchQueries: [getPostInfoById],
        onError(error) {
          toast(getErrorMessageFromApolloError(error), { type: "error" });
        },
      });
    }
  };
  const avatarUrl = data?.getPostInfoById?.creator_info?.avatar_url ?? "";
  const name = data?.getPostInfoById?.creator_info?.name ?? "";


  const isPostAdmin = user?.getCurrentUser?.id === post?.creator_id

  return (
    <>
      <MainSiteNavbar/>
      {!postId || userDataLoading || isPostLoading || !post ? (
        <div className="alert max-w-3xl my-2 mx-auto bg-gradient-to-r from-sky-300 to-cyan-300">
          Fetching post... ?????????
        </div>
      ) : (
        <div className="max-w-4xl mx-auto w-full break-words">
          <img
            src={post.cover_image_url}
            className="flex-grow h-64 w-full object-cover border border-blue-200"
          />
          <div className="px-4">
            <div className="text-4xl font-black mt-5 mb-3">{post.title}</div>

            <UserAvatar
              user={post.creator_info}
              avatarClassName="w-7"
              textClassName="text-base"
            />
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-3">
              {dayjs(parseFloat(post.published_on) * 1000).format(
                "ddd, MMM D, YYYY h:mm A"
              )}
              <BookOpenIcon className="w-6" />
              {post.approx_read_time_in_minutes} min read
            </div>

            {isPostAdmin && (
              <Link href={EDIT_POST(post.post_id)}>
                <button className="btn btn-outline btn-sm mt-4">Edit this post</button>
              </Link>
            )}

            <div className="text-sm pt-3 pb-4" data-color-mode="light">
              <Markdown
                source={post.desc_full_markdown}
                className="bg-base-200"
                rehypePlugins={[rehypeSanitize]}
              />
            </div>

            <div className="flex gap-5 text-sm mb-7">
              <button
                onClick={togglePostLike}
                className="btn btn-ghost btn-circle flex text-pink-400 flex-col justify-center items-center"
              >
                {authUserPostState?.is_post_liked_by_me ? (
                  <HeartIcon className="w-7" />
                ) : (
                  <HeartOutlineIcon className="w-7" />
                )}
                {post.liked_by_count}
              </button>
              <div className="flex py-1 flex-col text-blue-400 justify-center items-center">
                <ChatAltIcon className="w-7" />
                {post.number_of_comments}
              </div>
            </div>
            <PostCommentsComponent postId={postId} />
          </div>
        </div>
      )}
    </>
  );
};
