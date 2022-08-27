import { Entity, Schema } from "redis-om";
import { PriceCurrency } from "src/generated_graphql_types";
import { dbClient } from ".";

interface ListingBuyModel {
    buyer_id: string,
    listing_id: string,
    price: number,
    bought_at: string,
    currency: PriceCurrency,
}

class ListingBuyModel extends Entity { }

const listingBuyModelSchema = new Schema(ListingBuyModel, {
    buyer_id: {type: 'string', indexed: true},
    listing_id: {type: 'string', indexed: true},
    bought_at: {type: 'string', indexed: true},
    price: {type: 'number', indexed: true}, // since the user can increase the price, we need to store the original price
    currency: {type: 'string', indexed: true},
},{
    dataStructure: 'JSON',
    indexedDefault: true,
});


export const listingBuyModelRepository=dbClient.fetchRepository(listingBuyModelSchema)

listingBuyModelRepository.createIndex()
