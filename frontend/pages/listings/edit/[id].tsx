import { Field, Form, Formik, useFormikContext } from "formik";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { MDEditorWrapper } from "../../../components/MDEditorWrapper";
import { MainSiteNavbar } from "../../../components/Navbar.tsx/MainSiteNavbar";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import AddOrEditListingScreen, {
  NewListingScreenInput,
} from "../../../components/NewListingScreen";
import {
  CreateOrEditListingInput,
  ListingType,
  Mutation,
  PriceCurrency,
  Query,
  QueryGetListingInfoByIdArgs,
} from "../../../graphql/generated_graphql_types";
import { useRouter } from "next/router";
import { gql, useMutation, useQuery } from "@apollo/client";
import { createOrEditListing } from "../new";
import { getErrorMessageFromApolloError } from "../../../utils/getErrorMessageFromApolloError";
import { toast } from "react-toastify";
import {
  DETAILED_LISTING,
  MANAGE_PRODUCT_LISTING_CONTENT,
} from "../../../config/ScreenRoutes";
import { Loading } from "../../../components/Commons/Loading";

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

const EditListing = () => {
  const router = useRouter();

  const listingId = router.query.id as string;

  const [mutateFunction] = useMutation<
    Mutation,
    { payload: CreateOrEditListingInput }
  >(createOrEditListing);

  const { loading, data } = useQuery<Query, QueryGetListingInfoByIdArgs>(
    getListingInfoById,
    {
      variables: {
        listing_id: listingId,
      },
      skip: !listingId,
    }
  );

  const handleListingUpdate = async (val: NewListingScreenInput) => {
    mutateFunction({
      variables: {
        payload: {
          cover_image_url: val.cover_image_url,
          currency: val.currency,
          desc_full_markdown: val.desc_full_markdown,
          includes_chat_support: val.includes_chat_support,
          includes_video_call_support: val.includes_video_call_support,
          listing_type: val.listing_type,
          name: val.name,
          price: val.price,
          show_in_discover: val.show_in_discover,
          video_duration: val.video_duration,
          tags: val.tags.map((tag) => tag.value),
          id: listingId,
        },
      },
      onError(error) {
        toast.error(getErrorMessageFromApolloError(error));
      },
      onCompleted(data) {
        if (val.listing_type === ListingType.Service) {
          // go to detailed listing page
          router.push(
            DETAILED_LISTING(val.listing_type, data.createOrEditListing.id)
          );
        } else {
          router.push(
            MANAGE_PRODUCT_LISTING_CONTENT(data.createOrEditListing.id)
          );
        }
      },
    });
  };

  return (
    <div>
      <MainSiteNavbar />

      {loading && <Loading text="Loading listing..." />}

      {data?.getListingInfoById && (
        <AddOrEditListingScreen
          handleSubmit={handleListingUpdate}
          initialValues={{
            ...data.getListingInfoById,
            tags: data.getListingInfoById.tags.map((tag) => ({
              value: tag,
              label: tag,
            })),
          }}
        />
      )}
    </div>
  );
};

export default EditListing;
