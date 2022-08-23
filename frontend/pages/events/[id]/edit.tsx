import { withAuth } from "../../../authGuards/withAuth"
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import { CreateOrEditEventInput, CreateOrEditPostInput, Mutation, Post, Query, QueryGetEventInfoByIdArgs } from "../../../graphql/generated_graphql_types"
import { gql, useMutation, useQuery } from "@apollo/client"
import { createOrEditPost } from "../../../graphql/queries/createOrEditPost"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { DETAILED_EVENT, DETAILED_POST } from "../../../config/ScreenRoutes"
import { getErrorMessageFromApolloError } from "../../../utils/getErrorMessageFromApolloError"
import { CreateOrEditPostForm } from "../../../components/CreateOrEditPostForm"
import { MainSiteNavbar } from "../../../components/Navbar.tsx/MainSiteNavbar";
import { CreateOrEditEventForm } from "../../../components/CreateOrEditEventForm";
import { Loading } from "../../../components/Commons/Loading";



const createOrEditEvent = gql`


mutation createOrEditEvent($payload: CreateOrEditEventInput!){
  createOrEditEvent(payload: $payload) {
    cover_image_url
    desc_full_markdown
    duration_in_minutes
    event_id
    event_start_time
    is_member_only_event
    location_type
    number_of_registrations
    show_in_discover
    title
    organizer_id
  }
}
`


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
    tags
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

const NewEvent = () => {
    const router = useRouter()

    const [mutateFunction] = useMutation<Mutation, { payload: CreateOrEditEventInput }>(createOrEditEvent)


    const { loading, data } = useQuery<Query, QueryGetEventInfoByIdArgs>(getEventInfoById, {
        variables: {
            event_id: router.query.id as string
        },
    });

    const handleEventUpdate = async (val: any) => {

        mutateFunction({
            variables: {
                payload: {
                    cover_image_url: val.cover_image_url,
                    desc_full_markdown: val.desc_full_markdown,
                    duration_in_minutes: Math.round(((new Date(val.event_end_time).getTime()) - (new Date(val.event_start_time).getTime()))/(60000)),
                    is_member_only_event: val.is_member_only_event,
                    show_in_discover: val.show_in_discover,
                    event_start_time: val.event_start_time,
                    location_type: val.location_type,
                    title: val.title,
                    tags: val.tags.map((e: any) => e.value),
                    additional_info: val.additional_info,
                    event_url: val.event_url,
                    address: val.address,
                    event_id: router.query.id as string
                }
            },
            onError(error) {
                toast(getErrorMessageFromApolloError(error), { type: 'error' })

            },
            onCompleted(data) {
                router.push(DETAILED_EVENT(data.createOrEditEvent.event_id))
            },
        })
    }

    console.log(data)

    let eventEndTime=new Date();

    if(data?.getEventInfoById?.event_start_time){
        eventEndTime=new Date(data.getEventInfoById.event_start_time)
        eventEndTime.setMinutes(eventEndTime.getMinutes() - eventEndTime.getTimezoneOffset())
        eventEndTime.setMinutes(eventEndTime.getMinutes() + data.getEventInfoById.duration_in_minutes)
        console.log(eventEndTime)
    }
    

    return (
        <>
            <MainSiteNavbar />


            {loading || !data ?
                <Loading text="Loading..." />
                :
                <CreateOrEditEventForm
                    initialValues={{
                        ...(data.getEventInfoById),
                        ...(data.authUserEventState?.joining_info),
                        event_end_time: eventEndTime.toISOString().slice(0,16),
                        tags: data.getEventInfoById.tags.map(e => ({label: e, value: e}))
                    }}
                    handleSubmit={handleEventUpdate}
                />}
        </>
    )
}

export default withAuth(NewEvent)







