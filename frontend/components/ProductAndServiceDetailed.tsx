import { BriefcaseIcon, CursorArrowRaysIcon, LinkIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import { StarIcon, CurrencyDollarIcon, CurrencyRupeeIcon, ChatBubbleBottomCenterIcon, VideoCameraIcon } from "@heroicons/react/24/solid"
import { ListingProductItem, ListingType, PriceCurrency, UserPublicInfo } from "../graphql/generated_graphql_types"
import { ProductIcon } from "../icons/Product"
import { ServiceIcon } from "../icons/Service"
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic"
import Link from "next/link"
import { CHAT_DETAILED_SCREEN, EDIT_LISTING, SERVE_PRODUCT_ITEM_FILE, VIDEO_SESSION_START } from "../config/ScreenRoutes"
import { useRouter } from "next/router"


const Markdown = dynamic(
    () => import("@uiw/react-markdown-preview"),
    { ssr: false }
);

type Props = {
    data: {
        id: string,
        type: ListingType,
        name: string,
        cover_image_url: string,
        desc_full_markdown: string,
        price: number,
        currency: PriceCurrency,
        author: UserPublicInfo,
        includes_chat_support: boolean,
        includes_video_call_support: boolean,
        product_items: ListingProductItem[],
        buy_instance_id: string
        review_score: number,
        number_of_reviews: number,
        isAdmin: boolean,
        is_published: boolean
    }
}



export const ProductAndServiceDetailed = ({ data }: Props) => {
    const router = useRouter()


    return (

        <div className='relative'>

            <img src={data.cover_image_url} className='sm:col-span-2 flex-grow w-full h-60 object-cover rounded-lg border border-blue-200' />



            <div className="px-4 pt-4">

                <div className='mt-2 mb-5'>
                    <div className="mt-2 mb-3 font-bold text-2xl flex items-center gap-2">
                        {data.type === ListingType.Service ? <div className="tooltip tooltip-right" data-tip="This is a digital product offering"><ProductIcon className="w-7" /></div> : <div className="tooltip" data-tip="This is a service offering"><ServiceIcon className="w-7" /></div>}
                        <div> {data.name}</div>
                    </div>

                    <a className="underline flex gap-1 items-center my-1 text-sm">
                        <div className="avatar">
                            <div className="w-6 rounded-full">
                                <img src={data.author.avatar_url} />
                            </div>
                        </div>
                        <div>
                            {data.author.name}
                        </div>
                    </a>
                </div>



                <div className="absolute left-0 right-0 w-full border-t border-gray-300"></div>

                <div className="flex justify-between pt-2 mt-auto">

                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <StarIcon className="w-5 text-black" /> {data.review_score.toFixed(2)} ({data.number_of_reviews} reviews)
                    </div>
                    <div className="price_tag flex items-center gap-2 bg-warning px-2 text-xs w-fit py-2 text-gray-700">

                        <div className="flex items-center gap-1">
                            <div>
                                {data.currency === PriceCurrency.Usd ? <CurrencyDollarIcon className='w-5' /> : <CurrencyRupeeIcon className='w-5' />}
                            </div>
                            <div>Price:</div>
                        </div>
                        <div>{data.price === 0 ? "Free" : `${data.price} ${data.currency.toUpperCase()}`}</div>
                    </div>


                </div>


                {!data.is_published && <div className="bg-gray-200 my-2 rounded-lg border text-sm py-4 px-3 justify-start">Note: This listing is not published yet on your profile.</div>}


                {data.isAdmin && <Link href={EDIT_LISTING(data.id)}>
                    <button className="btn btn-secondary"><PencilSquareIcon className="w-6" /> Manage this listing</button>

                </Link>}


                {data.buy_instance_id === "" && <div className="flex justify-end mt-3">
                    <button className="py-2 md:flex-grow-0 flex-grow btn-primary w-60">Get this {data.type === ListingType.DigitalProduct ? "product" : "service"} offering</button>
                </div>}



                {data.buy_instance_id !== "" && <div className="flex gap-2 justify-start flex-col items-start text-sm mt-6 mb-7 py-6 px-4 rounded-md alert-success">
                    <div>
                        Hurray! 🎉 You&apos;ve got this listing. Please enjoy the product / service offering.
                    </div>
                    <div className="divider my-0"></div>
                    <div className="flex gap-2 flex-col text-sm">
                        <div className="font-bold text-base flex min-w-max text-gray-700 items-center gap-1">
                            <BriefcaseIcon className="w-5" />
                            {data.type === ListingType.DigitalProduct && <div>Please click on the product items below to download the files.</div>}
                            {data.type === ListingType.Service && <div>The service offering are listed below.</div>}
                        </div>

                    </div>
                </div>}



                {data.type === ListingType.Service && <div className="mt-2 mb-5">
                    <div className="font-bold text-lg mb-1">
                        Included Services
                    </div>
                    <div className="flex max-w-[300px] flex-col justify-center gap-2 my-4">
                        {data.includes_chat_support && (
                            <div onClick={() => data.buy_instance_id && router.push(CHAT_DETAILED_SCREEN(data.buy_instance_id))} className={`flex gap-2 items-center ${data.buy_instance_id && 'btn'}`} data-tip="Includes chat support">
                                <VideoCameraIcon className="w-8" /> <div>Video Call</div>
                            </div>
                        )}
                        {data.includes_video_call_support && <div onClick={() => data.buy_instance_id && router.push(VIDEO_SESSION_START(data.buy_instance_id))} className={`flex gap-2 items-center ${data.buy_instance_id && 'btn'}`} data-tip="Includes video chat support">
                            <ChatBubbleBottomCenterIcon className="w-8" /><div>Chat</div>

                        </div>}
                    </div>
                </div>}


                {data.type === ListingType.DigitalProduct && <div className="mt-2 mb-5">
                    <div className="font-bold text-lg mb-1">
                        Included Product Items
                    </div>

                    {data.product_items.map((item, index) => (
                        <div key={index} className='bg-base-200 py-6 px-4 border rounded-md flex gap-3 items-center my-2'>
                            <div className="avatar">
                                <div className="w-12 h-fit rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src="https://unsplash.com/photos/hoS3dzgpHzw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8cHJvZHVjdCUyMGFic3RyYWN0fGVufDB8fHx8MTY2MTMzNjAyMg&force=true&w=640" />
                                </div>
                            </div>

                            <div>
                                <a target={data.buy_instance_id && '_blank'} rel="noreferrer" href={data.buy_instance_id ? SERVE_PRODUCT_ITEM_FILE(data.buy_instance_id, item.id) : "#"}>
                                    <div className={`font-bold flex gap-1 ${data.buy_instance_id && 'text-blue-600 underline'}`}>
                                        <div>{item.file_name}</div>
                                        {data.buy_instance_id && <CursorArrowRaysIcon className="w-5" />}
                                    </div>
                                </a>

                                <div className="text-sm">
                                    {item.description}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>}




                {/* For Products */}
                <div className="absolute mt-3 mb-5 left-0 right-0 w-full border-t border-gray-300"></div>

                <div className="text-gray-500 pt-5 font-black">
                    Product Description
                </div>

                <div className="text-sm pb-4" data-color-mode="light">
                    <Markdown source={data.desc_full_markdown} className='bg-base-200' style={{ whiteSpace: 'pre-wrap' }} />
                </div>
            </div>
        </div>
    )

}
