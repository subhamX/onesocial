import { StarIcon, CurrencyDollarIcon, CurrencyRupeeIcon, ChatAlt2Icon, VideoCameraIcon } from "@heroicons/react/solid"
import { ProductIcon } from "../icons/Product"
import { ServiceIcon } from "../icons/Service"




export const ProductAndServiceDetailed = () => {

    const instance = {
        "type": "virtual_service",
        "title": "Illustrations",
        "price": 0,
        "price_currency": "usd",
        "cover_image_url": "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
        "is_chat_support_available": true,
        "is_video_support_available": true,
        "reviews_score": 4.0,
        "number_of_reviews": 150,
        "author": "heya",
        author_avatar: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
        id: "aajs",
    }

    return (

        <div className='relative'>

            <img src={instance.cover_image_url} className='sm:col-span-2 flex-grow w-full h-60 object-cover rounded-lg border border-blue-200' />



            <div className="px-4 pt-4">

                <div className='mt-2 mb-5'>
                    <div className="mt-2 mb-3 font-bold text-2xl flex items-center gap-2">
                        {instance.type === 'virtual_product' ? <div className="tooltip" data-tip="This is a virtual product"><ProductIcon className="w-7" /></div> : <div className="tooltip" data-tip="This is virtual service"><ServiceIcon className="w-7" /></div>}
                        <div> {instance.title}</div>
                    </div>

                    <a className="underline flex gap-1 items-center my-1 text-sm">
                        <div className="avatar">
                            <div className="w-6 rounded-full">
                                <img src={instance.author_avatar} />
                            </div>
                        </div>
                        <div>
                            {instance.author}
                        </div>
                    </a>
                </div>





                <div className="absolute left-0 right-0 w-full border-t border-gray-300"></div>


                <div className="flex justify-between pt-2 mt-auto">

                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <StarIcon className="w-5 text-black" /> {instance.reviews_score.toFixed(2)} ({instance.number_of_reviews})
                    </div>
                    <div className="price_tag flex items-center gap-2 bg-warning px-2 text-xs w-fit py-2 text-gray-700">

                        <div className="flex items-center gap-1">
                            <div>
                                {instance.price_currency === 'usd' ? <CurrencyDollarIcon className='w-5' /> : <CurrencyRupeeIcon className='w-5' />}
                            </div>
                            <div>Price:</div>
                        </div>
                        <div>{instance.price === 0 ? "Free" : `${instance.price} ${instance.price_currency.toUpperCase()}`}</div>
                    </div>


                </div>


                <div className="flex items-center gap-2 mb-3">
                    {instance.is_chat_support_available ? <div className="tooltip tooltip-right z-20" data-tip="Includes chat support"> <ChatAlt2Icon className="w-8" /> </div> : null}
                    {instance.is_video_support_available ? <div className="tooltip tooltip-right z-10" data-tip="Includes video chat support"> <VideoCameraIcon className="w-8" /> </div> : null}
                </div>

                <div className="absolute left-0 right-0 w-full border-t border-gray-300"></div>


                <div className="mt-10">
                    TODO: render Markdown
                </div>
            </div>
        </div>
    )

}
