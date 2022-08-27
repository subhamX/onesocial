import Link from "next/link";
import { USER_WALL_SCREEN } from "../../config/ScreenRoutes";
import { UserPublicInfo } from "../../graphql/generated_graphql_types";

export function UserAvatar({ user, width='w-5' }: { user: UserPublicInfo, width?: string }) {
    return <Link href={USER_WALL_SCREEN(user.user_id)}>
        <div className="underline flex gap-1 items-center text-gray-500 cursor-pointer">
            <div className="avatar flex items-center">
                <div className={width+ " rounded-full"}>
                    <img src={user.avatar_url} />
                </div>
            </div>
            <div className="text-sm">
                {user.name}
            </div>
        </div>

    </Link>
}
