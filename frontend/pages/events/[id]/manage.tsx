import { gql, useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router"
import { useState } from "react";
import { toast } from "react-toastify";
import { Loading } from "../../../components/Commons/Loading";
import { MainSiteNavbar } from "../../../components/Navbar.tsx/MainSiteNavbar"
import { DASHBOARD_URL, EDIT_EVENT, USER_WALL_SCREEN } from "../../../config/ScreenRoutes";
import { Query, QueryGetRegisteredGuestsInEventArgs } from "../../../graphql/generated_graphql_types";
import { getErrorMessageFromApolloError } from "../../../utils/getErrorMessageFromApolloError";

const getRegisteredGuestsInEvent = gql`
query($event_id: String!){
  getRegisteredGuestsInEvent(event_id: $event_id) {
    avatar_url 
    name
    tagline
    user_id
  }
}
`

const ManageEvent = () => {
    const router = useRouter();
    const eventId = router.query.id as string



    const { loading, data } = useQuery<Query, QueryGetRegisteredGuestsInEventArgs>(getRegisteredGuestsInEvent, {
        variables: {
            event_id: eventId
        },
        skip: !eventId,
        onError(error) {
            toast.error(getErrorMessageFromApolloError(error));
            router.push(DASHBOARD_URL)
        },
    })
    return (
        <div>
            <MainSiteNavbar />


            <div className="max-w-4xl px-4 mx-auto">


                <div className="flex justify-between mt-5">
                    <div className="text-2xl font-black">Manage Event</div>
                    <Link href={EDIT_EVENT(eventId)}>
                        <button className="btn btn-sm normal-case btn-secondary mt-2">Edit Event Details</button>
                    </Link>
                </div>

                <div className="mt-6">
                    <SendMessageToGuests eventId={eventId} />
                </div>

                <div className="text-lg font-bold mt-6 mb-4">Current Registered Guests</div>


                {loading && <Loading text="Fetching all guests info..." />}

                {data?.getRegisteredGuestsInEvent && data?.getRegisteredGuestsInEvent.length === 0 && <div className="alert my-2 mx-auto alert-info">There are no registrations so far!</div>}

                {data?.getRegisteredGuestsInEvent && !!data?.getRegisteredGuestsInEvent.length && data?.getRegisteredGuestsInEvent.map((e, indx) => (
                    <Link key={indx} href={USER_WALL_SCREEN(e.user_id)}>
                        <div className='flex gap-4 cursor-pointer border border-gray-500 bg-gray-100 py-3 px-2 my-4 hover:bg-gray-200'>
                            <div className="avatar">
                                <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={e.avatar_url} />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-sm font-bold">
                                    {e.name}
                                </div>
                                <div className="text-xs">
                                    {e.tagline}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}



            </div>
        </div>
    )

}

export default ManageEvent


const sendEmailToEventGuests = gql`
mutation sendEmailToEventGuests($event_id: String!, $message: String!){
  sendEmailToEventGuests(event_id: $event_id, message: $message)
}
`
const SendMessageToGuests = ({ eventId }: { eventId: string }) => {
    const [message, setMessage] = useState("");

    const [mutateFunction] = useMutation(sendEmailToEventGuests, {
        onError(error) {
            toast.error(getErrorMessageFromApolloError(error));
        },
        onCompleted(data) {
            toast.success("Message sent successfully!");
        },
    })

    const handleEmailSend = () => {
        mutateFunction({
            variables: {
                event_id: eventId,
                message: message
            }
        })
    }
    return (
        <div className="w-full flex flex-col gap-1">
            <div className="text-lg font-bold">Send Email to participants</div>
            <textarea className="textarea w-full max-w-lg rounded-none textarea-bordered" onChange={(e) => setMessage(e.target.value)} />
            <button className="mt-2 btn btn-sm normal-case w-fit" onClick={handleEmailSend}>Send</button>
        </div>
    )
}


