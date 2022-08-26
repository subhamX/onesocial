import { StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { DETAILED_LISTING } from "../../config/ScreenRoutes";
import { Listing, ListingType } from "../../graphql/generated_graphql_types";
import { ProductIcon } from "../../icons/Product";
import { ServiceIcon } from "../../icons/Service";

export function ProductOrServiceUI({ listingInstance: instance }: { listingInstance: Listing; }): JSX.Element {
    return <Link
        href={DETAILED_LISTING(instance.listing_type, instance.id)}>
        <div className='relative border-gray-300 border pt-6 pb-2 my-3 px-6 gap-3 cursor-pointer hover:bg-base-200'>

            <img src={instance.cover_image_url} className='sm:col-span-2 flex-grow w-full h-40 object-cover rounded-lg border border-blue-200' />


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

    </Link>;
}
