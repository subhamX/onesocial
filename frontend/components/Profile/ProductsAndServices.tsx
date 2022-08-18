import { CurrencyDollarIcon, CurrencyRupeeIcon } from "@heroicons/react/outline"
import { BookOpenIcon, StarIcon } from "@heroicons/react/solid"
import Link from "next/link"
import { DETAILED_POST, DETAILED_PRODUCT_AND_SERVICES } from "../../config/ScreenRoutes"
import { ProductIcon } from "../../icons/Product"
import { ServiceIcon } from "../../icons/Service"

const productsAndServices = [{
    "type": "virtual_service",
    "title": "hello",
    "price": 0,
    "price_currency": "usd",
    cover_image_url: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
    "is_video_support_available": true,
    "is_chat_support_available": true,
    // "description": "This is an awesome service",
    "reviews_score": 4.0,
    "number_of_reviews": 100,
    "author": "heya",
    author_avatar: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
    id: "aajs",

},
{
    "type": "virtual_product",
    "title": "Illustrations",
    "price": 0,
    "price_currency": "usd",
    "cover_image_url": "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
    // "description": "This is an awesome product",
    "reviews_score": 4.0,
    "number_of_reviews": 150,
    "author": "heya",
    author_avatar: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
    id: "aajs",
    "is_video_support_available": true,
    "is_chat_support_available": true,


    // "uploads_url": [""], // only
}, {
    "type": "virtual_service",
    "title": "hello",
    "price": 0,
    "price_currency": "usd",
    cover_image_url: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
    "is_video_support_available": true,
    "is_chat_support_available": true,
    // "description": "This is an awesome service",
    "reviews_score": 4.0,
    "number_of_reviews": 100,
    "author": "heya",
    author_avatar: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
    id: "aajs",

},
{
    "type": "virtual_product",
    "title": "Illustrations",
    "price": 0,
    "price_currency": "usd",
    "cover_image_url": "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
    "is_video_support_available": true,
    "is_chat_support_available": true,
    "reviews_score": 5.0,
    "number_of_reviews": 150,
    "author": "heya",
    author_avatar: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",

    id: "aajs",
    // "uploads_url": [""], // only
}, {
    "type": "virtual_service",
    "title": "hello",
    "price": 0,
    "price_currency": "usd",
    cover_image_url: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
    "is_chat_support_available": true,
    "is_video_support_available": true,
    // "description": "This is an awesome service",
    "reviews_score": 4.0,
    "number_of_reviews": 100,
    "author": "heya",
    author_avatar: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
    id: "aajs",

},
{
    "type": "virtual_product",
    "title": "Illustrations",
    "price": 0,
    "price_currency": "usd",
    "cover_image_url": "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
    "is_chat_support_available": true,
    "is_video_support_available": true,
    "reviews_score": 4.05,
    "number_of_reviews": 150,
    "author": "heya",
    author_avatar: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
    id: "aajs",


    // "uploads_url": [""], // only
}]

export const ProductsAndServices = () => (
    <div>
        <div className="my-3 max-w-4xl mx-auto px-4">
            <div className="alert max-w-3xl my-2 mx-auto alert-info">Crunching latest products and services... ⟨䷄⟩</div>
            <>

                <div className="alert max-w-3xl my-2 mx-auto alert-info">No products or services listed yet!</div>


                <div className="grid  sm:grid-cols-2 gap-3">
                    {productsAndServices.map((instance, indx) => (
                        <Link
                            href={DETAILED_PRODUCT_AND_SERVICES(instance.type as any, instance.id)}
                            key={indx}>
                            <div className='relative border-gray-300 border pt-6 pb-2 my-3 px-6 gap-3 cursor-pointer hover:bg-base-200'>

                                <img src={instance.cover_image_url} className='sm:col-span-2 flex-grow w-full h-60 object-cover rounded-lg border border-blue-200' />


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
                                    <div className="tag flex items-center gap-2 bg-warning px-2 text-xs w-fit py-2 text-gray-700">

                                        <div className="flex items-center gap-1">
                                            <div>
                                            <div>{instance.price===0? "Free": `${instance.price} ${instance.price_currency.toUpperCase()}`}</div>
                                            </div>
                                            <div>Price:</div>
                                        </div>
                                        <div>{instance.price} {instance.price_currency.toUpperCase()}</div>
                                    </div>

                                </div>

                            </div>

                        </Link>
                    ))}

                </div>

            </>

        </div>
    </div>
)
