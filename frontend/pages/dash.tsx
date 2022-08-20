import { useQuery } from "@apollo/client"
import { withAuth } from "../authGuards/withAuth"
import { MainSiteNavbar } from "../components/Navbar.tsx/MainSiteNavbar"
import { GET_CURRENT_USER } from "../graphql/queries/getCurrentUser"




const Dash = () => {

    const {loading, data, error}=useQuery(GET_CURRENT_USER)

    console.log(data, loading, error)
    return (
        <div>
            <MainSiteNavbar/>

            Hi from dash
        </div>
    )
}

export default withAuth(Dash)
