import { Entity, Schema } from "redis-om";
import { dbClient } from ".";

export interface UserFollowerModel {
    creator_id: string,
    title: string,
    desc_full_markdown: string,
    cover_image_url: string,
    liked_by_count: number,
    published_on: string, // It seems to be okay
    number_of_comments: number,
    approx_read_time_in_minutes: number,
    show_in_discover: boolean
    tags: string[]
}

export class UserFollowerModel extends Entity { }

const userFollowerModelSchema = new Schema(UserFollowerModel, {
    creator_id: { type: 'string', indexed: true }, // to get all followers by user
    followed_at: {type: 'date', sortable: true},
    follower_id: {type: 'string', indexed: true} // to get if a user is following a user
}, {
    dataStructure: 'JSON',
    indexedDefault: true,
});


export const userFollowerModelRepository = dbClient.fetchRepository(userFollowerModelSchema)

userFollowerModelRepository.createIndex()
