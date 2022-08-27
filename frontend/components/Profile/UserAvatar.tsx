import Link from "next/link";
import { USER_WALL_SCREEN } from "../../config/ScreenRoutes";
import { UserPublicInfo } from "../../graphql/generated_graphql_types";

export function UserAvatar({
  user,
  avatarClassName = "w-5",
  textClassName = "text-sm",
}: {
  user: UserPublicInfo;
  avatarClassName?: string;
  textClassName?: string;
}) {
  return (
    <Link href={USER_WALL_SCREEN(user.user_id)}>
      <div className="flex gap-1 items-center text-gray-500 cursor-pointer">
        <div className="avatar flex items-center">
          <div className={avatarClassName + " rounded-full"}>
            <img src={user.avatar_url} />
          </div>
        </div>
        <div className={`${textClassName}`}>{user.name}</div>
      </div>
    </Link>
  );
}
