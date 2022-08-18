import { AnnotationIcon, BookOpenIcon, BriefcaseIcon, HeartIcon } from "@heroicons/react/solid";
import { HeartIcon as HeartOutlineIcon, ChatAltIcon, VideoCameraIcon, HomeIcon, ClockIcon, UserGroupIcon, LightningBoltIcon, UserCircleIcon } from "@heroicons/react/outline";

import { Form, Formik } from "formik";
import { FormInputField } from "./Forms/FormInputField";
import { MainSiteNavbar } from "./Navbar.tsx/MainSiteNavbar";
import { UserProfileSiteLogo } from "./Navbar.tsx/UserProfileSiteLogo";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import Image from "next/image";

dayjs.extend(duration)
dayjs.extend(relativeTime)

type CommentProp = {
    user_avatar: string,
    name: string,
    posted_at: string,
    comment: string,
    is_deleted: boolean,
}

type Props = {
    event: {
        title: string,
        event_start_time: string,
        duration_in_minutes: number,
        cover_image_url: string,
        is_members_only: boolean, // if false, then anyone can join
        location_type: 'virtual' | 'in_person',

        event_url?: string, // incase of virtual
        address?: string, // incase of in_person

        number_of_registrations: number,
        // number_of_approved_guests: number, // only for admin

        owner_id: string,
        event_id: string,

        description: string,


        creator_avatar: string,
        creator_name: string

    },

}

export const EventsDetailedScreen = ({ event, }: Props) => {

    // const togglePostLike = () => {
    //     // TODO: Graphql logic to toggle like
    //     // If the user is not logged in then put an alert to login
    //     const userLoggedIn=false
    //     if(!userLoggedIn){
    //         alert('Please login to ❤️ the post.')
    //         return
    //     }
    // }

    const isLoggedIn = false;
    const isCurrentLoggedInUserAMember = false;
    const isEventAdmin = true;
    const isMemberRegistered = true;



    return (
        <>
            <MainSiteNavbar leadingBlock={
                <UserProfileSiteLogo siteTitle={'heya'} />
            } />
            <div className="alert max-w-3xl my-2 mx-auto alert-info">Fetching event details... ⟨䷄⟩</div>

            {
                <div className="max-w-4xl mx-auto">
                    <img src={event.cover_image_url} className='flex-grow h-64 w-full object-cover rounded-lg border border-blue-200' />
                    <div className="px-4">
                        <div className="text-4xl font-black mt-5 mb-2">{event.title}</div>


                        <div className="flex text-sm items-center gap-3">
                            <div className="font-medium text-gray-500 flex items-center gap-1"><UserCircleIcon className="w-6"/> Created By:</div>
                            <div className="tooltip" data-tip={event.creator_name}>
                                <div className="avatar">
                                    <div className="w-7 rounded-full">
                                        <img src="https://placeimg.com/192/192/people" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-1 text-sm text-gray-400 pt-1">
                            <div className="flex gap-1 items-center">
                                <div className="font-medium text-gray-500 flex items-center gap-1"><LightningBoltIcon className="w-6"/> Start Time:</div> {dayjs(event.event_start_time).format('ddd, MMM D, YYYY h:mm A')}
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="font-medium text-gray-500 flex items-center gap-1"><ClockIcon className="w-6"/> Duration:</div> {dayjs.duration({ minutes: event.duration_in_minutes }).humanize()} (approx)
                            </div>

                            {event.number_of_registrations ?
                                <div className="flex gap-6 items-center">
                                    <div className="font-medium text-gray-500 flex items-center gap-1"><UserGroupIcon className="w-6"/> Guests:</div> <div className="flex gap-1 items-center">{event.number_of_registrations}+</div>
                                </div> : null}

                            <div className="flex gap-4 items-center">
                                <div className="font-medium text-gray-500 flex items-center gap-1">{event.location_type === 'virtual' ? <VideoCameraIcon className="w-6" /> : <HomeIcon className="w-6" />}Location:</div> <div className="flex gap-1 items-center">{event.location_type}</div>
                            </div>

                           


                        </div>

                        <div className="mt-5"></div>


                        {isEventAdmin ? <>
                            <button className="btn btn-outline btn-sm">Manage Event</button>
                        </> :
                            <>
                                {isMemberRegistered ?
                                    <div className="flex gap-3 justify-start flex-col items-start text-sm mt-6 alert alert-success">
                                        <div className="">
                                            🎉 You&apos;re already registered.
                                        </div>
                                        <div className="divider"></div>
                                        <div className="flex gap-2">
                                            <div className="font-medium  flex min-w-max text-gray-700 items-center gap-1">
                                                <BriefcaseIcon className="w-5" />
                                                <div>Joining Info:</div>
                                            </div>
                                            <div className="text-gray-600 flex-wrap">{event.location_type === 'virtual' ? event.event_url : event.address}</div>
                                        </div>
                                    </div>
                                    :
                                    <>

                                        {!isLoggedIn && <div className="alert alert-warning alert-sm">
                                            <div className="text-sm text-gray-600"><AnnotationIcon className="w-6" /> {event.is_members_only && "This is a members only event."} Please login to register for the event.</div>
                                            <div className="btn btn-primary btn-outline btn-sm">Login</div>
                                        </div>}

                                        {isLoggedIn && (event.is_members_only && !isCurrentLoggedInUserAMember) && <div className="alert alert-warning alert-sm text-sm">Sorry. It&apos;s a members only event</div>}

                                        {isLoggedIn && (!event.is_members_only || (event.is_members_only && isCurrentLoggedInUserAMember)) && <div className="btn btn-sm btn-outline">Register Now</div>}
                                    </>
                                }

                            </>}

                        <div className="text-sm text-gray-500 pt-3 pb-4">
                            TODO: Render markdown
                            {event.description}
                        </div>



                        { }
                    </div>

                </div>
            }


        </>
    )
}


