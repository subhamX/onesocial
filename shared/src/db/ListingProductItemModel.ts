import { Entity, Schema } from "redis-om";
import { dbClient } from ".";

export interface ListingProductItemModel {
  listing_id: string;
  name: string;
  description: string;
  owner_id: string;
}

export class ListingProductItemModel extends Entity {}

const listingProductItemModelSchema = new Schema(
  ListingProductItemModel,
  {
    listing_id: { type: "string", indexed: true },
    owner_id: { type: "string", indexed: true }, // de-normalized data, to check access
    name: { type: "string", indexed: true },
    description: { type: "string" },
  },
  {
    dataStructure: "JSON",
    indexedDefault: true,
  }
);

export const listingProductItemModelRepository = dbClient.fetchRepository(
  listingProductItemModelSchema
);

listingProductItemModelRepository.createIndex();
