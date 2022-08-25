import { gql, useQuery } from "@apollo/client"
import { StarIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { DETAILED_LISTING } from "../../config/ScreenRoutes"
import { ListingType, Query, QueryGetListingsInWallArgs } from "../../graphql/generated_graphql_types"
import { ProductIcon } from "../../icons/Product"
import { ServiceIcon } from "../../icons/Service"
import { Loading } from "../Commons/Loading"

const getListingsInWall = gql`

query getListingsInWall($offset: Int!, $limit: Int!, $wall_id: String!){
  getListingsInWall(offset: $offset, limit: $limit, wall_id: $wall_id) {
    author {
      avatar_url
      name
      tagline
      user_id
    }
    author_id
    cover_image_url
    currency
    desc_full_markdown
    id
    includes_chat_support
    includes_video_call_support
    buy_instance_id
    listing_type
    name
    number_of_product_items
    number_of_reviews
    price
    product_items {
      description
      file_name
      id
      listing_id
    }
    reviews_score
    show_in_discover
    tags
    video_duration
  }
}

`


export const ProductsAndServices = () => {
    const router = useRouter();
    const [hasMore, setHasMore] = useState(true)


    const userId = router.query.id as string;
    const { loading, data, fetchMore } = useQuery<Query, QueryGetListingsInWallArgs>(getListingsInWall, {
        variables: {
            limit: 10,
            offset: 0,
            wall_id: userId,
        },
        skip: (!userId),
        fetchPolicy: 'cache-and-network',
        onCompleted(data) {
            if (data.getListingsInWall.length < 10) setHasMore(false)
        }
    })


    const productsAndServices = data?.getListingsInWall ?? []

    return (
        <div>

            {loading && !data?.getListingsInWall && <Loading text='Crunching latest products and services... ⟨䷄⟩' />}

            {data?.getListingsInWall && productsAndServices.length === 0 && <div className="alert max-w-3xl my-2 mx-auto alert-info">No products or services listed yet!</div>}

            {productsAndServices.length !== 0 && <div className="my-3 max-w-4xl mx-auto px-4">
                <div className="grid  sm:grid-cols-2 gap-3">
                    {productsAndServices.map((instance, indx) => (
                        <Link
                            href={DETAILED_LISTING(instance.listing_type, instance.id)}
                            key={indx}>
                            <div className='relative border-gray-300 border pt-6 pb-2 my-3 px-6 gap-3 cursor-pointer hover:bg-base-200'>

                                <img src={instance.cover_image_url} className='sm:col-span-2 flex-grow w-full h-60 object-cover rounded-lg border border-blue-200' />


                                <div className='mt-2 mb-5'>
                                    <div className="mt-2 mb-3 font-bold text-2xl flex items-center gap-2">
                                        {instance.listing_type === ListingType.DigitalProduct ? <div className="tooltip" data-tip="It's a digital product offering"><ProductIcon className="w-7" /></div> : <div className="tooltip" data-tip="It's a service offering"><ServiceIcon className="w-7" /></div>}
                                        <div> {instance.name}</div>
                                    </div>

                                    <a className="underline flex gap-1 items-center my-1 text-sm">
                                        <div className="avatar">
                                            <div className="w-6 rounded-full">
                                                <img src={instance.author.avatar_url} />
                                            </div>
                                        </div>
                                        <div>
                                            {instance.author.name}
                                        </div>
                                    </a>
                                </div>





                                <div className="absolute left-0 right-0 w-full border-t border-gray-300"></div>
                                <div className="flex justify-between pt-2 mt-auto">
                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                        <StarIcon className="w-5 text-black" /> {instance.reviews_score.toFixed(2)} ({instance.number_of_reviews} reviews)
                                    </div>
                                    <div className="price_tag flex items-center gap-2 bg-warning px-2 text-xs w-fit py-2 text-gray-700">

                                        <div className="flex items-center gap-1">
                                            <div>Price:</div>

                                            <div className="font-bold">{instance.price === 0 ? "Free" : `${instance.price} ${instance.currency.toUpperCase()}`}</div>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </Link>
                    ))}

                </div>

                <div className='mb-10'>

                    {hasMore ? <button className="btn btn-primary" onClick={() => fetchMore({
                        variables: {
                            offset: (productsAndServices.length),
                            limit: 10,
                            wall_id: userId
                        },
                    }).then(e => {
                        if (e.data.getListingsInWall.length < 10) setHasMore(false);
                    })}>Load more...</button> : <div className='alert font-black text-gray-500 flex text-sm justify-center'>That&apos;s the end.. 🎉</div>}
                </div>
            </div>}
        </div>
    )
}
