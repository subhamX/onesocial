import { useQuery } from "@apollo/client";
import { Menu } from "@headlessui/react";
import { ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon, BoltIcon, BookmarkIcon, CodeBracketSquareIcon, CommandLineIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { toast } from "react-toastify";
import {
  BLOG_URL,
  DASHBOARD_URL,
  FEATURES_URL_HASH,
  GITHUB_URL,
  LOGOUT_URL,
  NEW_USER_WELCOME_URL,
} from "../../config/ScreenRoutes";
import { apolloClient } from "../../graphql";
import { Query } from "../../graphql/generated_graphql_types";
import { GET_CURRENT_USER } from "../../graphql/queries/getCurrentUser";
import { GitHubIcon } from "../../icons/GitHub";
import { Logo } from "../UI/Icons/Logo";

export const MainSiteNavbar = ({
  leadingBlock,
}: {
  leadingBlock?: ReactNode;
}) => {
  const { loading, error, data } = useQuery<Query>(GET_CURRENT_USER);

  const is_logged_in = !loading && !error && data?.getCurrentUser !== null;

  const router = useRouter();
  const currentRoute = router.pathname;

  const logOutUser = async () => {
    try {
      const res = await fetch(LOGOUT_URL);
      const json = await res.json();
      if (json.error) throw new Error(json.message);
      toast(json.message, {
        type: "success",
      });
      apolloClient.refetchQueries({
        include: "active",
      });
    } catch (err) {
      toast((err as any).message, {
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-16 px-4 flex border-b-gray-700 border-b">
      <nav className="mx-auto w-full max-w-6xl flex items-center justify-between sm:gap-3 md:gap-7">
        {leadingBlock ? (
          leadingBlock
        ) : (
          <div className="font-bold text-2xl text-left flex-grow">
            <Link href={is_logged_in ? DASHBOARD_URL : '/'}>
              <div>
                <Logo className="w-44 sm:w-36 md:w-44 cursor-pointer btn btn-ghost px-0 py-0" />
              </div>

            </Link>
          </div>
        )}
        <div className="hidden sm:flex justify-between flex-grow items-center">
          <div className="flex justify-between gap-4 mx-2">
            <Link href={FEATURES_URL_HASH}>
              <div className="cursor-pointer btn btn-sm h-full btn-ghost space-x-1">
                <BoltIcon className="w-5" />
                <div>Features</div>
              </div>
            </Link>
            {/* <a rel="noreferrer" target='_blank' href={BLOG_URL}>
              <div className="cursor-pointer btn btn-sm btn-ghost space-x-1">
                <LightBulbIcon className="w-5" />
                <div>Blog</div>
              </div>
            </a> */}
            <a rel="noreferrer" target='_blank' href={GITHUB_URL}>
              <div className="cursor-pointer btn btn-sm h-full btn-ghost space-x-1">
                <GitHubIcon className="w-5" />
                <div>GitHub</div>
              </div>
            </a>
          </div>
          <div className="flex gap-3 items-center">
            {is_logged_in ? (
              <>
                <Link href={DASHBOARD_URL}>
                  {/* Only for Authenticated User */}
                  <div className="btn btn-sm btn-primary">Dashboard</div>
                </Link>

                {/* Only for Authenticated User */}
                <div
                  onClick={logOutUser}
                  className="btn btn-sm btn-primary btn-outline"
                >
                  Log Out
                </div>
              </>
            ) : (
              <Link href={NEW_USER_WELCOME_URL}>
                {/* Only for Non Authenticated User */}
                <div className="btn btn-sm btn-primary">Login</div>
              </Link>
            )}
          </div>
        </div>

        <Menu>
          {({ open }) => (
            <>
              <Menu.Button className="btn btn-ghost normal-case block text-sm xss:text-base sm:hidden">
                {open ? "Close" : "Menu"}
              </Menu.Button>
              <MyDropdown logOutUser={logOutUser} is_logged_in={is_logged_in} />
            </>
          )}
        </Menu>
      </nav>
    </div>
  );
};

function MyDropdown({
  is_logged_in,
  logOutUser,
}: {
  is_logged_in: boolean;
  logOutUser: () => void;
}) {
  return (
    <>
      <Menu.Items className="sm:hidden bg-base-100 absolute top-16 left-0 bottom-0 right-0 z-[100]">
        <Link href={FEATURES_URL_HASH}>
          <Menu.Item
            as="div"
            className="cursor-pointer w-full px-5 min-h-[80px] border-b border-b-black btn btn-ghost justify-start hover:border"
          >
            <div className="flex space-x-1 items-center">
              <BoltIcon className="w-5" />
              <div>Features</div>
            </div>
          </Menu.Item>
        </Link>

        <a rel="noreferrer" target='_blank' href={GITHUB_URL}>
          <Menu.Item
            as="div"
            className="cursor-pointer w-full px-5 min-h-[80px] border-b border-b-black btn btn-ghost justify-start hover:border"
          >
            <div className="flex space-x-1 items-center">
              <GitHubIcon className="w-5" />
              <div>GitHub</div>
            </div>
          </Menu.Item>
        </a>

        <a rel="noreferrer" target='_blank' href={BLOG_URL}>
          <Menu.Item
            as="div"
            className="cursor-pointer w-full px-5 min-h-[80px] border-b border-b-black btn btn-ghost justify-start hover:border"
          >
            <div className="flex space-x-1 items-center">
              <LightBulbIcon className="w-5" />
              <div>Blog</div>
            </div>
          </Menu.Item>
        </a>



        {is_logged_in ? (
          <>
            <Link href={DASHBOARD_URL}>
              <Menu.Item
                as="div"
                className="cursor-pointer w-full px-5 min-h-[80px] border-b border-b-black btn btn-ghost justify-start hover:border"
              >
                {/* Only for Authenticated User */}

                <div className="flex space-x-1 items-center">
                  <CommandLineIcon className="w-5" />
                  <div>Dashboard</div>
                </div>
              </Menu.Item>
            </Link>

            <Menu.Item
              as="div"
              className="cursor-pointer w-full px-5 min-h-[80px] border-b border-b-black btn btn-ghost justify-start hover:border"
              onClick={logOutUser}
            >
              {/* Only for Authenticated User */}
              <div className="flex space-x-1 items-center">
                <ArrowLeftOnRectangleIcon className="w-5" />
                <div>Log Out</div>
              </div>
            </Menu.Item>
          </>
        ) : (
          <Link href={NEW_USER_WELCOME_URL}>
            <Menu.Item
              as="div"
              className="cursor-pointer w-full px-5 min-h-[80px] border-b border-b-black btn btn-ghost justify-start hover:border"
            >
              {/* Only for Non Authenticated User */}
              <div className="flex space-x-1 items-center">
                <ArrowRightOnRectangleIcon className="w-5" />
                <div>Login</div>
              </div>
            </Menu.Item>
          </Link>
        )}
      </Menu.Items>
    </>
  );
}
