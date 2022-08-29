import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import { Loading } from "../../components/Commons/Loading";
import { MainSiteNavbar } from "../../components/Navbar.tsx/MainSiteNavbar"
import { CHAT_DETAILED_SCREEN } from "../../config/ScreenRoutes";
import { Query } from "../../graphql/generated_graphql_types";


const getAllChatSessions = gql`

query getAllChatSessions{
  getAllChatSessions {
    bought_at
    buy_instance_id
    session_as_buyer
    listing {
      id
      author {
        avatar_url
        name
      }
      cover_image_url
      name
    }
    buyer_info {
      avatar_url
      name
      tagline
      user_id
    }
  }
}

`

const AllChatSessions = () => {

    const { data, loading } = useQuery<Query>(getAllChatSessions)

    const chatSessionMeta = data?.getAllChatSessions ?? []

    return (
        <div>

            <MainSiteNavbar />

            <div className="max-w-2xl mx-auto px-4 mt-5">

                <div className="text-2xl font-black mb-6">Messages</div>

                {loading && <Loading text="Fetching all the chat session details" />}


                {!loading && chatSessionMeta.length === 0 && <div className="alert max-w-3xl my-2 mx-auto bg-gradient-to-r from-sky-300 to-cyan-300">
                    There are no chat sessions yet. 🥲
                </div>}

                <div>

                    {chatSessionMeta.map((e, indx) => {
                        return (
                            <Link key={indx} href={CHAT_DETAILED_SCREEN(e.buy_instance_id)}>
                                <div className='cursor-pointer card card-compact border border-gray-400 bg-gray-100 shadow-xl my-5'>
                                    <img className="h-[15vh] object-cover" src={e.listing.cover_image_url} alt="Shoes" />
                                    <div className="card-body">
                                        <div className="font-black text-lg">{e.listing.name}</div>
                                        <div>Service Provider: {e.session_as_buyer ? `${e.listing.author.name}` : "You"}</div>
                                        <div className="text-gray-400 text-sm flex space-x-1 items-center">
                                            <div>Bought by </div>
                                            <div className="text-gray-500">{e.session_as_buyer ? "You" : `${e.buyer_info?.name}`}</div>
                                            <div>on: {new Date(e.bought_at).toLocaleTimeString()} , {new Date(e.bought_at).toDateString()}</div>
                                        </div>
                                    </div>

                                </div>

                            </Link>
                        )
                    })}

                </div>
            </div>

        </div>
    )
}

export default AllChatSessions;
