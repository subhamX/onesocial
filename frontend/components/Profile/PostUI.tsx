import {
  BookOpenIcon,
  HeartIcon,
  ChatBubbleBottomCenterIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { DETAILED_POST } from "../../config/ScreenRoutes";
import { Post } from "../../graphql/generated_graphql_types";
import { UserAvatar } from "./UserAvatar";

export const PostUI = ({
  post,
}: {
  post: Omit<Post, "comments" | "creator_id">;
}) => {
  return (
    <Link href={DETAILED_POST(post.post_id)}>
      <div className="card card-compact my-2 border border-gray-400 bg-gray-50 shadow-xl py-8 px-6 grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-10 cursor-pointer hover:bg-base-200">
        <div className="sm:col-span-3 break-words h-full">
          <div className="font-extrabold text-xl">{post.title}</div>

          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            <div className="flex items-center gap-1">
              <CalendarDaysIcon className="w-5" />{" "}
              {new Date(parseFloat(post.published_on) * 1000).toDateString()}
            </div>
            *
            <div className="flex items-center gap-1">
              <BookOpenIcon className="w-5" />
              {post.approx_read_time_in_minutes} min read
            </div>
          </div>

          <div className="mt-2">
            <UserAvatar user={post.creator_info} />
          </div>

          <div className="text-xs text-gray-500 pt-3 pb-4">
            {post.desc_mini}
          </div>

          <div className="flex gap-5 text-2xs">
            <div className="flex text-pink-400 flex-col justify-center items-center">
              <HeartIcon className="w-5" />
              {post.liked_by_count}
            </div>
            <div className="flex flex-col text-blue-400 justify-center items-center">
              <ChatBubbleBottomCenterIcon className="w-5" />
              {post.number_of_comments}
            </div>
          </div>
        </div>

        <img
          src={post.cover_image_url}
          className="sm:col-span-2 flex-grow w-full h-40 object-cover sm:w-64 rounded-lg border border-blue-200"
        />
      </div>
    </Link>
  );
};
