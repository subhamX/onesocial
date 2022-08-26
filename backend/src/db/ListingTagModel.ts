import { Entity, Schema } from "redis-om";
import { dbClient } from ".";

export interface ListingTagModel {
    label_aka_value: string,
    is_trending: boolean

}

export class ListingTagModel extends Entity { }

const ListingModelSchema = new Schema(ListingTagModel, {
    label_aka_value: {type: 'text', indexed: true},
    is_trending: {type: 'boolean', indexed: true}

},{
    dataStructure: 'JSON',
    indexedDefault: true,
});


export const listingTagModelRepository=dbClient.fetchRepository(ListingModelSchema)

listingTagModelRepository.createIndex()


