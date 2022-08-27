import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Loading } from "../../../components/Commons/Loading";
import { MainSiteNavbar } from "../../../components/Navbar.tsx/MainSiteNavbar";
import { ProductAndServiceDetailed } from "../../../components/ProductAndServiceDetailed";
import { DASHBOARD_URL } from "../../../config/ScreenRoutes";
import {
  Query,
  QueryGetListingInfoByIdArgs,
} from "../../../graphql/generated_graphql_types";
import { GET_CURRENT_USER } from "../../../graphql/queries/getCurrentUser";

const getListingInfoById = gql`
  query getListingInfoById($listing_id: String!) {
    getListingInfoById(listing_id: $listing_id) {
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
      is_published
    }
  }
`;

const Listings = () => {
  const router = useRouter();

  const id = router.query.id as string;

  const { loading, data } = useQuery<Query, QueryGetListingInfoByIdArgs>(
    getListingInfoById,
    {
      variables: {
        listing_id: id,
      },
      skip: !id,
      onError(error) {
        toast.error("Invalid listing id");
        router.push(DASHBOARD_URL);
      },
    }
  );

  const { loading: userLoading, data: userData } =
    useQuery<Query>(GET_CURRENT_USER);

  return (
    <>
      <MainSiteNavbar />

      {loading && <Loading text="Loading listing..." />}

      {!loading && data && data.getListingInfoById && (
        <div className="max-w-4xl mx-auto">
          <ProductAndServiceDetailed
            data={{
              id: data.getListingInfoById.id,
              type: data.getListingInfoById.listing_type,
              name: data.getListingInfoById.name,
              cover_image_url: data.getListingInfoById.cover_image_url,
              desc_full_markdown: data.getListingInfoById.desc_full_markdown,
              price: data.getListingInfoById.price,
              currency: data.getListingInfoById.currency,
              author: data.getListingInfoById.author,
              includes_chat_support:
                data.getListingInfoById.includes_chat_support,
              includes_video_call_support:
                data.getListingInfoById.includes_video_call_support,
              product_items: data.getListingInfoById.product_items,
              buy_instance_id: data.getListingInfoById.buy_instance_id,
              review_score: data.getListingInfoById.reviews_score,
              number_of_reviews: data.getListingInfoById.number_of_reviews,
              isAdmin:
                userData?.getCurrentUser?.id ===
                data.getListingInfoById.author_id,
              is_published: data.getListingInfoById.is_published,
            }}
          />
        </div>
      )}
    </>
  );
};

export default Listings;
