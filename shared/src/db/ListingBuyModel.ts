import { Entity, Schema } from "redis-om";
import { PriceCurrency } from "src/generated_graphql_types";
import { dbClientWithoutConnect } from ".";

export interface ListingBuyModel {
  buyer_id: string;
  listing_id: string;
  price: number;
  bought_at: string;
  currency: PriceCurrency;
  owner_id: string;
}

export class ListingBuyModel extends Entity {}

export const listingBuyModelSchema = new Schema(
  ListingBuyModel,
  {
    buyer_id: { type: "string", indexed: true },
    listing_id: { type: "string", indexed: true },
    bought_at: { type: "string", indexed: true },
    price: { type: "number", indexed: true }, // since the user can increase the price, we need to store the original price
    currency: { type: "string", indexed: true },
    owner_id: { type: "string", indexed: true }, // this de-normalization will help while trying to fetch all products which got sold of a user
  },
  {
    dataStructure: "JSON",
    indexedDefault: true,
  }
);
