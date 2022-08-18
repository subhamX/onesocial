import { EventsDetailedScreen } from "../../components/EventsDetailed"
import { PostsDetailedScreen } from "../../components/PostsDetailed"


const EventsDetailed = () => (
    <EventsDetailedScreen
    
    
    event={
            {
                cover_image_url: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
                event_start_time: "2022-08-02T10:46:26.261Z",
                is_members_only: true,
                duration_in_minutes: 10000,
                location_type: "in_person",
                address: "Awesome Arena, Near Green Park Metro Station, Delhi, India", // can be address
                event_url: "https://ajha.com",
                number_of_registrations: 11,
                owner_id: "177171",
                title: "Intro to cookies",
                event_id: "10",
                description: "We'll do this, and everything else.",
                creator_avatar: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
                creator_name: "Heya"
            }
        
    }/>
)


export default EventsDetailed
