import { gql, useQuery } from "@apollo/client"
import Link from "next/link"
import { Loading } from "../../components/Commons/Loading"
import { MainSiteNavbar } from "../../components/Navbar.tsx/MainSiteNavbar"
import { UserAvatar } from "../../components/Profile/UserAvatar"
import { DETAILED_EVENT, DETAILED_LISTING } from "../../config/ScreenRoutes"
import { Query, QueryGetEventsRegisteredArgs, QueryGetListingsBoughtArgs } from "../../graphql/generated_graphql_types"

const getEventsRegistered = gql`
query getEventsRegistered($offset: Int!, $limit: Int!){
  getEventsRegistered(offset: $offset, limit: $limit) {
    cover_image_url
    event_id
    organizer_id
    title
    event_start_time
    organizer {
      avatar_url
      name
      user_id
    }
  }
}
`

const EventsWhereIAmRegistered = () => {
    const { data, loading } = useQuery<Query, QueryGetEventsRegisteredArgs>(getEventsRegistered, {
        variables: {
            // TODO: we need to fix this pagination later?
            limit: 100,
            offset: 0
        }
    })

    return (

        <div>
            <MainSiteNavbar />

            <div className="max-w-2xl mx-auto px-4">

                <div className="text-2xl font-black my-5 mb-6">Registered Events</div>


                {loading && <Loading text="Crunching latest data..." />}


                {data?.getEventsRegistered && data?.getEventsRegistered.length === 0 && <div className="alert max-w-3xl my-2 mx-auto alert-info">You have not registered for any events yet!</div>}

                {data?.getEventsRegistered && !!data?.getEventsRegistered.length && data?.getEventsRegistered.map((e, indx) => (
                    <Link key={indx} href={DETAILED_EVENT(e.event_id)}>
                        <div className='flex gap-4 cursor-pointer border border-gray-500 bg-gray-100 py-3 px-2 my-4 hover:bg-gray-200'>
                            <div className="avatar flex items-center">
                                <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={e.cover_image_url} />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-base font-bold">
                                    Event: {e.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Start Time: {new Date(parseFloat(e.event_start_time) * 1000).toLocaleString()}
                                </div>

                                <div className="text-xs flex gap-1 items-center text-gray-400">
                                    <div>Hosted By:</div> <UserAvatar user={e.organizer} avatarClassName='w-5' textClassName="text-xs text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

            </div>
        </div>
    )
}


export default EventsWhereIAmRegistered
