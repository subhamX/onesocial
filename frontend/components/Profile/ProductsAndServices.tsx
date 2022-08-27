import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  Query,
  QueryGetListingsInWallArgs,
} from "../../graphql/generated_graphql_types";
import { Loading } from "../Commons/Loading";
import { ProductOrServiceUI } from "./ProductOrServiceUI";

const getListingsInWall = gql`
  query getListingsInWall($offset: Int!, $limit: Int!, $wall_id: String!) {
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
`;

export const ProductsAndServices = () => {
  const router = useRouter();
  const [hasMore, setHasMore] = useState(true);

  const userId = router.query.id as string;
  const { loading, data, fetchMore } = useQuery<
    Query,
    QueryGetListingsInWallArgs
  >(getListingsInWall, {
    variables: {
      limit: 10,
      offset: 0,
      wall_id: userId,
    },
    skip: !userId,
    fetchPolicy: "no-cache",
    onCompleted(data) {
      if (data.getListingsInWall.length < 10) setHasMore(false);
    },
  });

  const productsAndServices = data?.getListingsInWall ?? [];

  return (
    <div>
      {loading && !data?.getListingsInWall && (
        <Loading text="Crunching latest products and services... ⟨䷄⟩" />
      )}

      {data?.getListingsInWall && productsAndServices.length === 0 && (
        <div className="alert max-w-3xl my-2 mx-auto alert-info">
          No products or services listed yet!
        </div>
      )}

      {productsAndServices.length !== 0 && (
        <div className="my-3 max-w-4xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 gap-3">
            {productsAndServices.map((instance, indx) => (
              <ProductOrServiceUI key={indx} listingInstance={instance} />
            ))}
          </div>

          <div className="mb-10">
            {hasMore ? (
              <button
                className="btn btn-primary"
                onClick={() =>
                  fetchMore({
                    variables: {
                      offset: productsAndServices.length,
                      limit: 10,
                      wall_id: userId,
                    },
                  }).then((e) => {
                    if (e.data.getListingsInWall.length < 10) setHasMore(false);
                  })
                }
              >
                Load more...
              </button>
            ) : (
              <div className="alert font-black text-gray-500 flex text-sm justify-center">
                That&apos;s the end.. 🎉
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
