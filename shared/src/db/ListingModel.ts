import { Entity, Schema } from "redis-om";
import { ListingType, PriceCurrency } from "../generated_graphql_types";
import { dbClientWithoutConnect } from ".";

export interface ListingModel {
  // id: ID!

  // currency: PriceCurrency!
  // desc_full_markdown: String!
  // includes_chat_support: Boolean!
  // includes_video_call_support: Boolean!
  // listing_type: ListingType!
  // name: String!
  // price: Float!
  // show_in_discover: Boolean!
  // video_duration: Int! # it will be 0 if [includes_video_call_support] is false
  // cover_image_url: String!

  // reviews_score: Float!
  // number_of_reviews: Int!

  // author: UserPublicInfo!
  // tags: [String!]!

  currency: PriceCurrency;
  desc_full_markdown: string;

  listing_type: ListingType;
  name: string;
  price: number;
  show_in_discover: boolean;
  cover_image_url: string;
  reviews_score: number;
  number_of_reviews: number;
  tags: string[];

  author_id: string;
  published_at: string;
  is_published: boolean;

  // The following value is only valid for product listings
  number_of_product_items: number;

  // The following three are only valid for service listings
  includes_chat_support: boolean;
  includes_video_call_support: boolean;
  video_duration: number;
  created_at: string;
}

export class ListingModel extends Entity {}

export const listingModelSchema = new Schema(
  ListingModel,
  {
    currency: { type: "string", indexed: true },
    desc_full_markdown: { type: "string" },
    includes_chat_support: { type: "boolean", indexed: true },
    includes_video_call_support: { type: "boolean", indexed: true },
    listing_type: { type: "string", indexed: true },
    name: { type: "text", indexed: true },
    price: { type: "number" },
    show_in_discover: { type: "boolean", indexed: true },
    video_duration: { type: "number" },
    cover_image_url: { type: "string" },
    reviews_score: { type: "number" },
    number_of_reviews: { type: "number", sortable: true },
    tags: { type: "string[]", indexed: true },
    author_id: { type: "string", indexed: true },
    published_at: { type: "date", sortable: true },
    is_published: { type: "boolean", indexed: true },
    created_at: { type: "date" }, // it's just for analytics

    number_of_product_items: { type: "number" },
  },
  {
    dataStructure: "JSON",
    indexedDefault: true,
  }
);
