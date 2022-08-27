import { Entity, Schema } from "redis-om";
import { dbClient } from ".";

export interface UserFollowerModel {
    creator_id: string,
    followed_at: string,
    follower_id: string,
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
