import { useRouter } from "next/router"
import { useState } from "react"
import { MainSiteNavbar } from "../../components/Navbar.tsx/MainSiteNavbar"
import { UserProfileSiteLogo } from "../../components/Navbar.tsx/UserProfileSiteLogo"
import { EventsComponent } from "../../components/Profile/Events"
import { Posts } from "../../components/Profile/Posts"
import { ProductsAndServices } from "../../components/Profile/ProductsAndServices"


const mockData = {
    profile: {
        name: "Valdigo Neumaro", // keep it less than 16 chars
        bio_detail: "Hi, I'm an author, writing books on this awesome world. Follow me to learn more about it." // less than 250 chars
    },
    posts: {

    },

}


/*
TODO: 

<ul>
    <li>Add cover banner</li>
    <li>Add testimonials section maybe? Nah. lets leave it. content will move a lot</li>
    <li>Have a nice animation to move the content from left to right, and the new content repalcing it.</li>
    <li>Events will be w-full, and so is posts; Products and service will be grid?</li>
    <li>Search functionality user wise, and global wise</li>

    <li>For a product you can add multiple images.</li>
</ul>
*/


/*
TODO: CASES
1. User not logged in. -> show subscribe now, and make it as SignIn
2. user logged in and on his/her same page -> show 
3. user logged in and on other page -> show subscribe now
*/
const UserProfile = () => {
    const [currentTab, setCurrentTab] = useState(0);

    const router = useRouter()
    const userId = router.query.id as string;


    return (

        <>

            <MainSiteNavbar leadingBlock={
                <UserProfileSiteLogo siteTitle={mockData.profile.name} />
            } />


            <div className="">
                <div className="bg-red-50 py-10">
                    <div className="max-w-3xl mx-auto w-full px-4">
                        <div className="text-3xl font-light">
                            {mockData.profile.bio_detail}
                        </div>
                        <div className="mt-2 flex justify-end">
                            <div className="btn btn-accent">
                                Subscribe now
                            </div>
                        </div>
                    </div>
                </div>


                <div className="border-b mb-4 border-black" />


                <div className="flex flex-col items-center xs:flex-row justify-center gap-3 tabs tabs-boxed bg-base-100">
                    <a className={`tab ${currentTab == 0 && 'tab-active'}`} onClick={() => setCurrentTab(0)}>Posts</a>
                    <a className={`tab ${currentTab == 1 && 'tab-active'}`} onClick={() => setCurrentTab(1)}>Events</a>
                    <a className={`tab ${currentTab == 2 && 'tab-active'}`} onClick={() => setCurrentTab(2)}>Products &amp; Services</a>
                </div>


                {currentTab === 0 && <Posts
                    userId={userId}
                // isPostsLoading={false}

                // posts={[
                //     {
                //         cover_image_url: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
                //         except: "Hi, I'm an author, writing books on this awesome world. Follow me to learn more about it. We're humans, and the thing which makes us human is our a...",
                //         liked_by: 120,
                //         number_of_comments: 16,
                //         owner_id: "10",
                //         post_id: "177171",
                //         published_on: "2022-08-16T10:46:26.261Z",
                //         title: "How to build the best spacecraft?",
                //         approx_read_time_in_minutes: 2,

                //     },
                //     {
                //         cover_image_url: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
                //         except: "Hi, I'm an author, writing books on this awesome world. Follow me to learn more about it. We're humans, and the thing which makes us human is our a...",
                //         liked_by: 120,
                //         number_of_comments: 16,
                //         owner_id: "10",
                //         post_id: "177171",
                //         published_on: "2022-08-16T10:46:26.261Z",
                //         title: "How to build the best spacecraft?",
                //         approx_read_time_in_minutes: 2,
                //     }
                // ]}

                />}
                {currentTab === 1 && <EventsComponent
                    events={[
                        {
                            cover_image_url: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
                            event_start_time: "2022-08-02T10:46:26.261Z",
                            is_members_only: true,
                            duration_in_minutes: 100,
                            location_type: "virtual",
                            event_url: "https://ajha.com",
                            number_of_registrations: 1009,
                            owner_id: "177171",
                            title: "Intro to cookies",
                            event_id: "10"
                        }
                    ]}
                />}
                {currentTab === 2 && <ProductsAndServices />}




            </div>
        </>

    )
}


export default UserProfile



