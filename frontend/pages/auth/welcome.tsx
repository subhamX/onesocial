import Link from "next/link"
import { withNoAuth } from "../../authGuards/withNoAuth"
import { MainSiteNavbar } from "../../components/Navbar.tsx/MainSiteNavbar"
import { GOOGLE_AUTH_START, TWITTER_AUTH_START } from "../../config/ScreenRoutes"



// Screen with Buttons to signIn/Register
const AuthScreen = () => {
    return (
        <div>

            <MainSiteNavbar />

            <div className="mt-5">
                <div className="form-container">
                    <div className="px-4 py-6 flex flex-col gap-3">
                        <Link href={GOOGLE_AUTH_START}>
                            <button className="btn btn-primary btn-sm">Continue with google</button>
                        </Link>
                        <Link href={TWITTER_AUTH_START}>
                            <button className="btn btn-primary btn-sm">Continue with twitter</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default withNoAuth(AuthScreen)

