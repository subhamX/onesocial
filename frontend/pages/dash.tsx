import { useQuery } from "@apollo/client";
import { BuildingStorefrontIcon, CalendarDaysIcon, CalendarIcon, ChatBubbleOvalLeftEllipsisIcon, CreditCardIcon, PencilSquareIcon, PresentationChartBarIcon, UserCircleIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { withAuth } from "../authGuards/withAuth";
import { MainSiteNavbar } from "../components/Navbar.tsx/MainSiteNavbar";
import {
  ALL_CHAT_SESSIONS,
  ALL_CUSTOMERS,
  ALL_EVENTS_REGISTERED,
  CREATE_NEW_EVENT,
  CREATE_NEW_LISTING,
  CREATE_NEW_POST,
  DISCOVER,
  LISTINGS_BOUGHT_BY_ME,
  MY_FOLLOWERS,
  MY_FOLLOWINGS,
  MY_PROFILE_PROXY,
} from "../config/ScreenRoutes";
import { GET_CURRENT_USER } from "../graphql/queries/getCurrentUser";

const Dash = () => {
  const { loading, data, error } = useQuery(GET_CURRENT_USER);

  return (
    <div>
      <MainSiteNavbar />
      <div className="max-w-4xl mx-auto px-4">
        <div className="mt-6 mb-5 text-lg font-extrabold">
          Hi! Welcome to your dashboard.
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">


          <LinkTile
            icon={<PencilSquareIcon className="w-14" />}
            link={CREATE_NEW_POST}
            text="Create a new post"
          />

          <LinkTile
            icon={<CalendarDaysIcon className="w-14" />}
            link={CREATE_NEW_EVENT}
            text="Create a new event"
          />


          <LinkTile
            icon={<BuildingStorefrontIcon className="w-14" />}
            link={CREATE_NEW_LISTING}
            text="Create a new product or service"
          />


          <LinkTile
            icon={<UserCircleIcon className="w-14" />}
            link={MY_PROFILE_PROXY}
            text="My Profile"
          />


          <LinkTile
            icon={<PresentationChartBarIcon className="w-14" />}
            link={DISCOVER}
            text="Discover"
          />


          <LinkTile
            icon={<UserGroupIcon className="w-14" />}
            link={MY_FOLLOWINGS}
            text="My followings"
          />


          <LinkTile
            icon={<UserGroupIcon className="w-14" />}
            link={MY_FOLLOWERS}
            text="My followers"
          />


          <LinkTile
            icon={<CreditCardIcon className="w-14" />}
            link={LISTINGS_BOUGHT_BY_ME}
            text="Listings bought by me"
          />


          <LinkTile
            icon={<UserCircleIcon className="w-14" />}
            link={ALL_CUSTOMERS}
            text="All Customers"
          />

          <LinkTile
            icon={<CalendarIcon className="w-14" />}
            link={ALL_EVENTS_REGISTERED}
            text="Registered Events"
          />


          <LinkTile
            icon={<ChatBubbleOvalLeftEllipsisIcon className="w-14" />}
            link={ALL_CHAT_SESSIONS}
            text="Active Chat Sessions"
          />



        </div>
      </div>
    </div>
  );
};

export default withAuth(Dash);



const LinkTile = ({ link, text, icon }: { link: string, text: string, icon: JSX.Element }) => (
  <Link href={link}>
    <button className="card font-bold normal-case leading-6 card-compact border border-black py-4 px-2 bg-gradient-to-r from-rose-50 to-teal-50 hover:scale-105 shadow-lg btn btn-ghost h-full flex-col">
      {icon}
      <div>
        {text}
      </div>
    </button>
  </Link>
)
