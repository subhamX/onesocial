import { Entity, Schema } from "redis-om";
import { dbClient } from ".";

interface PostModel {
    post_id: string,
    name: string,
    email: string,
    avatar_url: string,
    is_google_account_connected: boolean,
    twitter_user_name: string,
    registered_at: Date,
    last_token_generated_at: Date
}

class PostModel extends Entity { }

const postModelSchema = new Schema(PostModel, {
    post_id: {type: 'string', indexed: true}, // to get the post by id
    creator_id: {type: 'string', indexed: true}, // to get all posts by user

    title: {type: 'string', indexed: true}, // indexed for full text search
    desc_full_markdown: {type:'string'},
    cover_image_url: {type: 'string'},

    liked_by_count: {type: 'number'},
    published_on: {type: 'date'},
    number_of_comments: {type: 'number'},
    approx_read_time_in_minutes: {type: 'number'},

    show_in_discover: {type: 'boolean', indexed: true}, // to know if we should publish it
},{
    dataStructure: 'JSON',
    indexedDefault: true,
});


export const postModelRepository=dbClient.fetchRepository(postModelSchema)

