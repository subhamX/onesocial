import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { Loading } from "../../components/Commons/Loading";
import { MainSiteNavbar } from "../../components/Navbar.tsx/MainSiteNavbar";
import { DETAILED_LISTING, LISTINGS_BOUGHT_BY_ME } from "../../config/ScreenRoutes";
import { Message, Mutation, MutationSendMessageArgs, Query, QueryGetChatSessionDetailsArgs } from "../../graphql/generated_graphql_types";
import { GET_CURRENT_USER } from "../../graphql/queries/getCurrentUser";
import { getErrorMessageFromApolloError } from "../../utils/getErrorMessageFromApolloError";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { Form, Formik } from "formik";
import { FormInputField } from "../../components/Forms/FormInputField";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
dayjs.extend(duration);
dayjs.extend(relativeTime);


const fetchNewMessageToActiveSessions = gql`

subscription fetchNewMessageToActiveSessions($buy_instance_id: String!) {
    fetchNewMessageOfSession(buy_instance_id: $buy_instance_id) {
        buy_instance_id
        sent_at
        message
        seen_by
        sent_by
        sent_by_user_avatar
        sent_by_user_name
    }
}
`


const getChatSessionDetails = gql`

query getChatSessionDetails($buy_instance_id: String!){
  getChatSessionDetails(buy_instance_id: $buy_instance_id) {
    message{
        buy_instance_id
        sent_at
        message
        seen_by
        sent_by
        sent_by_user_avatar
        sent_by_user_name
    }
    listing_id
    listingName
  }
}

`

const sendMessageMutation = gql`

mutation sendMessage($buy_instance_id: String!, $message: String!) {
  sendMessage(buy_instance_id: $buy_instance_id, message: $message)
}

`

const ChatSession = () => {
    const router = useRouter();
    const id = router.query.id as string;

    const [newMessages, setNewMessages] = useState<Message[]>([])

    useSubscription(fetchNewMessageToActiveSessions, {
        variables: {
            buy_instance_id: id,
        },
        skip: (!id),
        onSubscriptionData: ({ client, subscriptionData }) => {
            setNewMessages([...newMessages, subscriptionData.data.fetchNewMessageOfSession])
        }
    })

    // const { data: user, loading: userLoading } = useQuery<Query>(GET_CURRENT_USER)
    // const userId = user?.getCurrentUser?.id ?? ""

    const [mutateFunx] = useMutation<Mutation['sendMessage'], MutationSendMessageArgs>(sendMessageMutation)

    const { loading: chatHistoryLoading, data: chatHistory } = useQuery<Query, QueryGetChatSessionDetailsArgs>(getChatSessionDetails, {
        variables: {
            buy_instance_id: id,
        },
        skip: (!id),
        fetchPolicy: 'no-cache',
        onError(error) {
            toast.error(getErrorMessageFromApolloError(error));
            // router.push(LISTINGS_BOUGHT_BY_ME)
        },
        onCompleted(data) {
            console.log("keyy>")
            setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
            }, 500)
        },
    })
    // fetch last messages of the session
    const handleSubmit = (values: any, { resetForm }: any) => {
        mutateFunx({
            variables: {
                buy_instance_id: id,
                message: values.message,
            },
            onCompleted(data) {
                setTimeout(() => {
                    window.scrollTo(0, document.body.scrollHeight);
                }, 500)
                resetForm()
            },
            onError(error) {
                toast.error(getErrorMessageFromApolloError(error));
            },
        })
    }
    const loading = !chatHistory || chatHistoryLoading
    const totalMessages = [...(chatHistory?.getChatSessionDetails.message ?? []), ...newMessages]
    const listingName = chatHistory?.getChatSessionDetails.listingName
    const listingId = chatHistory?.getChatSessionDetails.listing_id ?? "#"

    return (
        <>
            <MainSiteNavbar />
            <div className="max-w-2xl mx-auto px-4 mb-10 mt-4">
                <div className="text-2xl font-black mb-6">Messenger</div>


                {loading && <Loading text="Crunching latest messages..." />}


                {!loading &&


                    <>

                        <Link href={DETAILED_LISTING('', listingId)}>
                            <div className="text-lg font-black mb-6 underline w-fit text-gray-700 cursor-pointer">Service Name: {listingName}</div>
                        </Link>

                        {totalMessages.length === 0 && (
                            <div className="flex flex-col text-sm border gap-1 px-4 -mt-3 py-4 h-full bg-gray-100 my-2">
                                Seems like an empty chat session! 🧐 Let's start talking!
                            </div>
                        )}

                        <div className="max-w-xl mx-auto ">



                            {totalMessages.map((e, indx) => (
                                <div key={indx}>
                                    <div className={`flex flex-col text-sm border gap-1 px-4 py-1 h-full bg-gray-100 my-2`}>
                                        <div className="text-xs text-gray-600 font-bold">{e.sent_by_user_name}</div>
                                        <div className="flex gap-3 mt-1">
                                            <div className="avatar h-full">
                                                <div className="w-7 h-7 rounded-full ring ring-primary ring-offset-base-100">
                                                    <img src={e.sent_by_user_avatar} className='h-full' />
                                                </div>
                                            </div>
                                            <div>
                                                {e.message}
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <div className="text-2xs text-gray-400">
                                                {dayjs(parseFloat(e.sent_at) * 1000).fromNow()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <Formik initialValues={{ message: '' }} onSubmit={handleSubmit}>
                                <Form className="flex ">
                                    <FormInputField fieldId="message" placeholder="Message..." />
                                    <button className="btn btn-primary normal-case gap-1" type="submit">Send<PaperAirplaneIcon className="w-6" /> </button>
                                </Form>
                            </Formik>

                        </div>
                    </>
                }

            </div>
        </>

    )
}

export default ChatSession;
