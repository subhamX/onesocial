import { Field, Form, Formik, useFormikContext } from "formik";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { MDEditorWrapper } from "../../components/MDEditorWrapper";
import { MainSiteNavbar } from "../../components/Navbar.tsx/MainSiteNavbar";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { EyeIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import AddOrEditListingScreen, {
  NewListingScreenInput,
} from "../../components/NewListingScreen";
import {
  CreateOrEditListingInput,
  ListingType,
  Mutation,
  PriceCurrency,
} from "../../graphql/generated_graphql_types";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { getErrorMessageFromApolloError } from "../../utils/getErrorMessageFromApolloError";
import { toast } from "react-toastify";
import {
  DETAILED_LISTING,
  MANAGE_PRODUCT_LISTING_CONTENT,
} from "../../config/ScreenRoutes";

export const createOrEditListing = gql`
  mutation createOrEditListing($payload: CreateOrEditListingInput!) {
    createOrEditListing(payload: $payload) {
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
      number_of_reviews
      price
      reviews_score
      show_in_discover
      tags
      video_duration
    }
  }
`;

const NewListing = () => {
  const router = useRouter();

  const [mutateFunction] = useMutation<
    Mutation,
    { payload: CreateOrEditListingInput }
  >(createOrEditListing);

  const handleListingCreation = async (val: NewListingScreenInput) => {
    mutateFunction({
      variables: {
        payload: {
          ...val,
          tags: val.tags.map((tag) => tag.value),
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

      <AddOrEditListingScreen
        initialValues={{
          currency: PriceCurrency.Inr,
          desc_full_markdown: "",
          includes_chat_support: false,
          includes_video_call_support: false,
          listing_type: ListingType.Service,
          name: "",
          price: 0,
          show_in_discover: true,
          video_duration: 0,
          tags: [],
          cover_image_url:
            "https://unsplash.com/photos/1_CMoFsPfso/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MTd8fHByb2R1Y3QlMjBhbmQlMjBzZXJ2aWNlc3xlbnwwfHx8fDE2NjEyODAyNDM&force=true&w=1920",
        }}
        handleSubmit={handleListingCreation}
      />
    </div>
  );
};

export default NewListing;
