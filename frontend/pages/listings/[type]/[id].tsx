import { ChatAlt2Icon, CurrencyDollarIcon, CurrencyRupeeIcon, StarIcon, VideoCameraIcon } from "@heroicons/react/solid";
import { useRouter } from "next/router"
import { ProductAndServiceDetailed } from "../../../components/ProductAndServiceDetailed";
import { ProductIcon } from "../../../icons/Product";
import { ServiceIcon } from "../../../icons/Service";



const Listings = () => {
    const router = useRouter()

    const type = router.query.type;
    const id = router.query.id;

    return (
        <div className="max-w-4xl mx-auto">
            <ProductAndServiceDetailed />
        </div>
    )
}

export default Listings



