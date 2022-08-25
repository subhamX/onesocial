import { withAuth } from "../../authGuards/withAuth"
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import { CreateOrEditEventInput, CreateOrEditPostInput, Mutation, Post } from "../../graphql/generated_graphql_types"
import { gql, useMutation } from "@apollo/client"
import { createOrEditPost } from "../../graphql/queries/createOrEditPost"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { DETAILED_EVENT, DETAILED_POST } from "../../config/ScreenRoutes"
import { getErrorMessageFromApolloError } from "../../utils/getErrorMessageFromApolloError"
import { CreateOrEditPostForm } from "../../components/CreateOrEditPostForm"
import { MainSiteNavbar } from "../../components/Navbar.tsx/MainSiteNavbar";
import { CreateOrEditEventForm } from "../../components/CreateOrEditEventForm";



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

const NewEvent = () => {
    const router = useRouter()

    const [mutateFunction] = useMutation<Mutation, { payload: CreateOrEditEventInput }>(createOrEditEvent)


    const handlePostCreation = async (val: any) => {
        
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

    return (
       <>
       <MainSiteNavbar />

       <CreateOrEditEventForm
            initialValues={{
                cover_image_url: "https://unsplash.com/photos/Xaanw0s0pMk/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MTN8fGNvdmVyJTIwaW1hZ2V8ZW58MHx8fHwxNjYxMjc5OTU5&force=true&w=1920",
                desc_full_markdown: "",
                is_member_only_event: false,
                show_in_discover: true,

                event_start_time: '',
                location_type: 'VIRTUAL',
                title: "",
                tags: [],

                additional_info: '',
                event_url: '',
                address: '',


                event_end_time: '',
            }}
            handleSubmit={handlePostCreation}
        />
       </>
    )
}

export default withAuth(NewEvent)







