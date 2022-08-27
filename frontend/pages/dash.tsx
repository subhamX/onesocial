import { useQuery } from "@apollo/client"
import Link from "next/link"
import { withAuth } from "../authGuards/withAuth"
import { MainSiteNavbar } from "../components/Navbar.tsx/MainSiteNavbar"
import { ALL_CUSTOMERS, CREATE_NEW_EVENT, CREATE_NEW_LISTING, CREATE_NEW_POST, DISCOVER, LISTINGS_BOUGHT_BY_ME, MY_FOLLOWERS, MY_FOLLOWINGS, MY_PROFILE_PROXY } from "../config/ScreenRoutes"
import { GET_CURRENT_USER } from "../graphql/queries/getCurrentUser"




const Dash = () => {

    const { loading, data, error } = useQuery(GET_CURRENT_USER)

    return (
        <div>
            <MainSiteNavbar />
            <div className="max-w-2xl mx-auto px-4">

                <div className="mt-6 mb-5 text-lg font-extrabold">Hi! Welcome to your dashboard.</div>


                <div className="flex flex-col gap-3">
                    <Link href={CREATE_NEW_POST}>
                        <button className="btn">Create a new post</button>
                    </Link>
                    <Link href={CREATE_NEW_EVENT}>
                        <button className="btn">Create a new event</button>
                    </Link>
                    <Link href={CREATE_NEW_LISTING}>
                        <button className="btn">Create a new product or service</button>
                    </Link>

                    <Link href={MY_PROFILE_PROXY}>
                        <button className="btn">Profile</button>
                    </Link>

                    <Link href={DISCOVER}>
                        <button className="btn">Discover</button>
                    </Link>

                    <Link href={MY_FOLLOWINGS}>
                        <button className="btn">My followings</button>
                    </Link>

                    <Link href={MY_FOLLOWERS}>
                        <button className="btn">My followers</button>
                    </Link>


                    <Link href={LISTINGS_BOUGHT_BY_ME}>
                        <button className="btn">Listings bought by me</button>
                    </Link>


                    <Link href={ALL_CUSTOMERS}>
                        <button className="btn">All Customers</button>
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default withAuth(Dash)
