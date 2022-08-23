


import { Entity, Schema } from "redis-om";
import { EventLocationType } from "src/generated_graphql_types";
import { dbClient } from ".";

export type EventModelType = {
    show_in_discover: boolean
    is_member_only_event: boolean,
    title: string,
    event_start_time: string, // it's a date string
    duration_in_minutes: number,
    cover_image_url: string,
    location_type: EventLocationType
    desc_full_markdown: string,
    number_of_registrations: number,
    tags: string[],
    organizer_id: string,
    posted_on: string // it's a date thing
    event_url: string | null
    address: string | null
    additional_info: string
}

export interface EventModel extends EventModelType {}

export class EventModel extends Entity { }

const eventModelSchema = new Schema(EventModel, {
    show_in_discover: {type: 'boolean', indexed: true}, // to get all events which are to be shown in discover
    is_member_only_event: {type: 'boolean'},
    title: {type: 'string', indexed: true}, // indexed for full text search 
    event_start_time: { type: 'string'},
    duration_in_minutes: {type: 'number'},
    cover_image_url: {type: 'string'},
    location_type: {type: 'string'},
    desc_full_markdown: {type: 'string'},
    number_of_registrations: {type: 'number'},
    tags: {type: 'string[]', indexed: true}, // to get all events by tag
    organizer_id: {type: 'string', indexed: true}, // to get all events by organizer id
    posted_on: {type: 'date'},

    // Private info
    event_url: {type: 'string'},
    address: {type: 'string'},
    additional_info: {type: 'string'}
},{
    dataStructure: 'JSON',
    indexedDefault: true,
});


export const eventModelRepository=dbClient.fetchRepository(eventModelSchema)


eventModelRepository.createIndex()
