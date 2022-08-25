import { ChatBubbleBottomCenterIcon as AnnotationIcon, BookOpenIcon, BriefcaseIcon, HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutlineIcon, ChatBubbleBottomCenterIcon as ChatAltIcon, VideoCameraIcon, HomeIcon, ClockIcon, UserGroupIcon, BoltIcon as LightningBoltIcon, UserCircleIcon } from "@heroicons/react/24/outline";

import { Form, Formik } from "formik";
import { FormInputField } from "./Forms/FormInputField";
import { MainSiteNavbar } from "./Navbar.tsx/MainSiteNavbar";
import { UserProfileSiteLogo } from "./Navbar.tsx/UserProfileSiteLogo";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import Image from "next/image";
import { useRouter } from "next/router";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Mutation, MutationRegisterForEventArgs, Query } from "../graphql/generated_graphql_types";
import { GET_CURRENT_USER } from "../graphql/queries/getCurrentUser";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import Link from "next/link";
import { MANAGE_EVENT } from "../config/ScreenRoutes";
import { toast } from "react-toastify";



dayjs.extend(duration)
dayjs.extend(relativeTime)

const Markdown = dynamic(
    () => import("@uiw/react-markdown-preview"),
    { ssr: false }
);


const getEventInfoById = gql`
# fetch events by id
query($event_id: String!){
  getEventInfoById(event_id: $event_id) {
    cover_image_url
    desc_full_markdown
    duration_in_minutes
    event_id
    event_start_time
    is_member_only_event
    location_type
    number_of_registrations
    organizer {
      avatar_url
      name
      user_id
    }
    organizer_id
    show_in_discover
    title
  }
  authUserEventState(event_id: $event_id) {
    event_id
    is_registered
    joining_info {
      additional_info
      address
      event_url
    }
    is_user_a_follower
  }
}
`

const registerForEventMutation = gql`
    mutation registerForEvent($event_id: String!){
        registerForEvent(event_id: $event_id)
    }

`

export const EventsDetailedScreen = () => {
    const router = useRouter()
    const eventId = router.query.id as string

    // fetch user
    const { loading: userDataLoading, data: user } = useQuery<Query>(GET_CURRENT_USER, {
        fetchPolicy: 'cache-only'
    });


    const { loading, data } = useQuery<Query>(getEventInfoById, {
        variables: {
            event_id: eventId,
        },
        skip: (!eventId)
    })


    const [mutateFn] = useMutation<Mutation['registerForEvent'], MutationRegisterForEventArgs >(registerForEventMutation)

    const handleEventRegister= () => {
        mutateFn({
            variables: {
                event_id: eventId
            },
            onCompleted(data) {
                toast.success("You have successfully registered for this event")
            },
            refetchQueries: [{query: getEventInfoById, variables: {event_id: eventId}}], // TODO: make this update locally
            onError(error) {
                toast.error(error.message)
            },
        })
    }

    const event = data?.getEventInfoById
    const authUserEventState = data?.authUserEventState
    const isLoggedIn = (authUserEventState !== null);
    const isCurrentLoggedInUserAMember = (!!data?.authUserEventState?.is_user_a_follower);
    const isEventAdmin = (user?.getCurrentUser?.id === event?.organizer_id);
    const isMemberRegistered = (authUserEventState?.is_registered);

    const avatarUrl = data?.getEventInfoById?.organizer?.avatar_url ?? ""
    const name = data?.getEventInfoById?.organizer?.name ?? ""

    if (!avatarUrl || !name) return null; // we need avatarUrl and name to render the navbar component




    return (
        <>
            <MainSiteNavbar leadingBlock={
                <UserProfileSiteLogo avatar_url={avatarUrl} siteTitle={name} />
            } />
            {loading && <div className="alert max-w-3xl my-2 mx-auto alert-info">Fetching event details... ⟨䷄⟩</div>}

            {event &&
                <div className="max-w-4xl mx-auto break-words">
                    <img src={event.cover_image_url} className='flex-grow h-64 w-full object-cover rounded-lg border border-blue-200' />
                    <div className="px-4">
                        <div className="text-4xl font-black mt-5 mb-2">{event.title}</div>




                        <div className="flex flex-col justify-center gap-1 text-sm text-gray-400 pt-1 max-w-sm">
                            <div className="grid grid-cols-2 text-sm items-center gap-3">
                                <div className="font-medium text-gray-500 flex items-center gap-1"><UserCircleIcon className="w-6" /> Created By:</div>
                                <div className="tooltip text-left w-fit" data-tip={event.organizer.name}>
                                    <div className="avatar">
                                        <div className="w-7 rounded-full">
                                            <img src={event.organizer.avatar_url} />
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="grid grid-cols-2 items-center">
                                <div className="font-medium text-gray-500 flex items-center gap-1"><LightningBoltIcon className="w-6" /> Start Time:</div>
                                <div>
                                    {dayjs(event.event_start_time).format('ddd, MMM D, YYYY h:mm A')}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                                <div className="font-medium text-gray-500 flex items-center gap-1"><ClockIcon className="w-6" /> Duration:</div>
                                <div>
                                    {dayjs.duration({ minutes: event.duration_in_minutes }).humanize()} (approx)
                                </div>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                                <div className="font-medium text-gray-500 flex items-center gap-1"><UserGroupIcon className="w-6" /> Guests:</div>
                                <div className="flex gap-1 items-center">{event.number_of_registrations === 0 ? 'None. (Would you be the first one. 🥺)' : `${event.number_of_registrations}+`}</div>
                            </div>

                            <div className="grid grid-cols-2 items-center">
                                <div className="font-medium text-gray-500 flex items-center gap-1">{event.location_type === 'VIRTUAL' ? <VideoCameraIcon className="w-6" /> : <HomeIcon className="w-6" />}Location:</div>
                                <div className="flex gap-1 items-center">{event.location_type}</div>
                            </div>




                        </div>

                        <div className="mt-5"></div>

                        {isEventAdmin && <Link href={MANAGE_EVENT(event.event_id)}>
                            <button className="btn btn-outline btn-sm">Manage Event</button>
                        </Link>}

                        {isMemberRegistered && authUserEventState?.joining_info ?
                            <div className="flex gap-2 justify-start flex-col items-start text-sm mt-6 py-6 px-4 rounded-md alert-success">
                                <div>
                                    Hurray! 🎉 You&apos;re registered.
                                </div>
                                <div className="divider my-0"></div>
                                <div className="flex gap-2 flex-col text-sm">
                                    <div className="font-bold text-base flex min-w-max text-gray-700 items-center gap-1">
                                        <BriefcaseIcon className="w-5" />
                                        <div>Joining Info:</div>
                                    </div>


                                    {authUserEventState.joining_info.additional_info && <div className="flex gap-2 text-gray-600">
                                        <div className="font-bold">Additional Info:
                                        </div>
                                        <div>
                                            {authUserEventState.joining_info.additional_info}

                                        </div>
                                    </div>}

                                    {authUserEventState.joining_info.address && <div className="flex gap-2 text-gray-600">
                                        <div className="font-bold">
                                            Address:
                                        </div>
                                        <div>
                                            {authUserEventState.joining_info.address}
                                        </div>
                                    </div>}
                                    {authUserEventState.joining_info.event_url && <div className="flex gap-2 text-gray-600">
                                        <div className="font-bold">
                                            Event URL:
                                        </div>
                                        <div>
                                            {authUserEventState.joining_info.event_url}
                                        </div>
                                    </div>}
                                </div>
                            </div>
                            :
                            <div className="mt-4">

                                {!isLoggedIn && <div className="alert alert-warning alert-sm">
                                    <div className="text-sm text-gray-600"><AnnotationIcon className="w-6" /> {event.is_member_only_event && "This is a members only event."} Please login to register for the event.</div>
                                    <div className="btn btn-primary btn-outline btn-sm">Login</div>
                                </div>}

                                {isLoggedIn && (event.is_member_only_event && !isCurrentLoggedInUserAMember) && <div className="alert alert-warning alert-sm text-sm">Sorry. It&apos;s a members only event. You cannot register for it. 😢</div>}

                                {isLoggedIn && (!event.is_member_only_event || (event.is_member_only_event && isCurrentLoggedInUserAMember)) && <div className="btn btn-sm btn-outline" onClick={handleEventRegister}>Register Now</div>}
                            </div>
                        }


                        <div className="text-gray-500 pt-5 font-black">
                            Event Details
                        </div>

                        <div className="text-sm pb-4" data-color-mode="light">
                            <Markdown source={event.desc_full_markdown} className='bg-base-200' style={{ whiteSpace: 'pre-wrap' }} />
                        </div>

                    </div>

                </div>
            }


        </>
    )
}


