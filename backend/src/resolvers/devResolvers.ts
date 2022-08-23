import { postTagModelRepository } from "../db/PostTagModel";
import { ApolloContext } from "../types/ApolloContext";
import { Event, EventLocationType, Mutation, MutationCreateOrEditEventArgs, MutationCreateOrEditPostArgs, MutationRegisterForEventArgs, MutationSubmitPostCommentArgs, MutationToggleFollowAUserArgs, MutationTogglePostLikeArgs, Post, PostComment, Query, QueryGetEventInfoByIdArgs, QueryGetEventsInWallArgs, QueryGetPostCommentsArgs, QueryGetPostInfoByIdArgs, QueryGetPostsInWallArgs, QueryGetPostTagsArgs, QueryGetUserInfoByWallIdArgs, QueryIsCurrentUserASubscriberArgs, UserPublicInfo } from "../generated_graphql_types";
import { PostModel, postModelRepository } from "../db/PostModel";
import * as yup from 'yup'
import { PostCommentModel, postCommentModelRepository } from "../db/CommentModel";
import { UserModel, userModelRepository } from "../db/UserModel";
import { postLikeModelRepository } from "../db/PostLikeModel";
import { EventModel, eventModelRepository, EventModelType } from "../db/EventModel";
import { eventTagModelRepository } from "../db/EventTagModel";
import { eventRegisteredMemberModelRepository } from "../db/EventRegisteredMemberModel";
import { userFollowerModelRepository } from "../db/UserFollowers";

type PostWithoutCommentsAndCreatorInfoType = Omit<Mutation['createOrEditPost'], 'comments' | 'creator_info'>
type PostCommentWithoutPostedByType = Omit<PostComment, 'posted_by'>


type EventWithoutOrganizerType = Omit<Event, 'organizer'>

const resolveUserPublicInfoFromId = async (userId: string): Promise<UserPublicInfo> => {
    const user = await userModelRepository.search().where('id').equal(userId).return.first()
    if (!user) throw new Error("Logic Error")

    const instance = user.toRedisJson() as UserModel;

    return {
        ...instance,
        user_id: user.id
    }
}

export const devResolvers = {
    Query: {
        getUserInfoByWallId: async (parent: any, args: QueryGetUserInfoByWallIdArgs, context: ApolloContext) => {
            const user = await userModelRepository.search().where('id').equal(args.wall_id).return.first()
            if (!user) throw new Error(`Invalid user id: ${args.wall_id}`)

            const instance = user.toRedisJson() as UserModel;

            return {
                ...instance,
                user_id: user.id
            }

        },

        isCurrentUserASubscriber: async (parent: any, args: QueryIsCurrentUserASubscriberArgs, context: ApolloContext): Promise<Query['isCurrentUserASubscriber']> => {
            if (!context.user) return false; // returning false as the user is not logged in

            const userFollowInstance = await userFollowerModelRepository.search()
                .where('creator_id').equal(args.wall_id)
                .where('follower_id').equal(context.user.id).return.first()
            if (!userFollowInstance) return false; // returning false as the user is not subscribed to the wall
            return true;
        },

        getPostTags: async (_: any, params: QueryGetPostTagsArgs, ctx: ApolloContext): Promise<Query['getPostTags']> => {
            if (!ctx.user) throw new Error('auth required')

            const tags = await postTagModelRepository.search().where('label_aka_value').match(`${params.query}*`).return.all()
            return tags.map(e => (e.label_aka_value)) ?? []
        },

        getPostInfoById: async (_: any, params: QueryGetPostInfoByIdArgs, ctx: ApolloContext): Promise<PostWithoutCommentsAndCreatorInfoType> => {
            // No auth required
            const instance = await postModelRepository.fetch(params.post_id)
            if (!instance.creator_id) throw new Error(`Invalid post_id: ${params.post_id}`)
            const returnVal = (instance.toRedisJson() as PostModel)

            return {
                ...returnVal,
                desc_mini: instance.desc_full_markdown.substring(0, 300),
                post_id: instance.entityId,
            }
        },

        authUserPostState: async (_: any, params: QueryGetPostInfoByIdArgs, { user }: ApolloContext): Promise<Query['authUserPostState']> => {
            if (!user) return null

            // TODO: check if the post is liked by me
            const instance = await postLikeModelRepository.search().where('user_id').equal(user.id).where('post_id').equal(params.post_id).return.first()

            return {
                is_post_liked_by_me: (!!instance),
                post_id: params.post_id
            }
        },

        getPostComments: async (_: any, params: QueryGetPostCommentsArgs, ctx: ApolloContext): Promise<Omit<PostComment, "posted_by">[]> => {
            const response = await postCommentModelRepository.search().where('post_id').equal(params.post_id).sortDesc('commented_at').page(params.offset, params.limit)

            const res = response.map(e => ({
                ...(e.toRedisJson() as PostCommentModel),
                comment_id: e.entityId
            })).reverse()

            return res
        },

        getPostsInWall: async (_: any, params: QueryGetPostsInWallArgs, ctx: ApolloContext): Promise<PostWithoutCommentsAndCreatorInfoType[]> => {
            // no auth required
            const response = await postModelRepository.search().where('creator_id').equal(params.wall_id).sortDesc('published_on').page(params.offset, params.limit)

            const res: PostWithoutCommentsAndCreatorInfoType[] = response.map((e): PostWithoutCommentsAndCreatorInfoType => ({
                ...(e.toRedisJson() as PostModel),
                post_id: e.entityId,
                desc_mini: e.desc_full_markdown.substring(0, 300),
            }))

            return res
        },

        getEventTags: async (_: any, params: QueryGetPostTagsArgs, ctx: ApolloContext): Promise<Query['getEventTags']> => {
            const tags = await eventTagModelRepository.search().where('label_aka_value').match(`${params.query}*`).return.all()
            return tags.map(e => (e.label_aka_value)) ?? []
        },


        getEventInfoById: async (_: any, params: QueryGetEventInfoByIdArgs, ctx: ApolloContext): Promise<EventWithoutOrganizerType> => {
            // No auth required
            const instance = await eventModelRepository.fetch(params.event_id)
            if (!instance.organizer_id) throw new Error(`Invalid event_id: ${params.event_id}`)
            const returnVal = (instance.toRedisJson() as EventModel)

            return {
                ...returnVal,
                event_id: instance.entityId,
            }

        },
        authUserEventState: async (_: any, params: QueryGetEventInfoByIdArgs, { user }: ApolloContext): Promise<Query['authUserEventState']> => {
            if (!user) return null

            const eventInstance = await eventModelRepository.fetch(params.event_id)
            if (!eventInstance.organizer_id) throw new Error(`Invalid event_id: ${params.event_id}`)

            // check if the current user is organizer or registered for the event
            let is_registered = (user.id === eventInstance.organizer_id)
            if (!is_registered) {
                const instance = await eventRegisteredMemberModelRepository.search().where('member_wall_id').equal(user.id).return.first()
                if (instance) is_registered = true
            }


            const userFollowerInstance = (eventInstance.organizer_id === user.id || await userFollowerModelRepository.search()
                .where('follower_id').equal(user.id)
                .where('creator_id').equal(eventInstance.organizer_id).return.first())


            return {
                event_id: params.event_id,
                joining_info: (is_registered ? {
                    additional_info: eventInstance.additional_info,
                    address: eventInstance.address,
                    event_url: eventInstance.event_url,
                } : null),
                is_registered,
                is_user_a_follower: (userFollowerInstance !== null)
            }
        },

        getEventsInWall: async (_: any, params: QueryGetEventsInWallArgs, ctx: ApolloContext): Promise<EventWithoutOrganizerType[]> => {
            // no auth required
            const response = await eventModelRepository.search().where('organizer_id').equal(params.wall_id).sortDesc('posted_on').page(params.offset, params.limit)

            const res: EventWithoutOrganizerType[] = response.map((e): EventWithoutOrganizerType => ({
                ...(e.toRedisJson() as EventModel),
                event_id: e.entityId,
            }))
            return res
        }
    },
    Mutation: {
        createOrEditPost: async (_: any, params: MutationCreateOrEditPostArgs, ctx: ApolloContext): Promise<PostWithoutCommentsAndCreatorInfoType> => {
            if (!ctx.user) throw new Error('auth required')

            const shape = yup.object().shape({
                "cover_image_url": yup.string().url().required(),
                "desc_full_markdown": yup.string().required().min(10),
                "post_id": yup.string(),
                "show_in_discover": yup.bool().required(),
                "title": yup.string().required().min(2).max(60),
                "tags": yup.array().of(yup.string()).required()
            })

            shape.validateSync(params.payload)

            // checking that all tags are correct!
            if (params.payload.tags.length) {
                const tagsSearch = await postTagModelRepository.searchRaw(`@label_aka_value:(${(params.payload.tags).join('|')})`).return.all()
                if (tagsSearch.length !== params.payload.tags.length) {
                    throw new Error('Invalid tags')
                }
            }


            let post = postModelRepository.createEntity()
            if (params.payload.post_id) {
                post = await postModelRepository.fetch(params.payload.post_id)
                if (post.creator_id !== ctx.user?.id) throw new Error('Invalid Id or permissions')
            }

            post.approx_read_time_in_minutes = 5; // TODO: fix it 
            post.creator_id = ctx.user.id
            post.title = params.payload.title
            post.desc_full_markdown = params.payload.desc_full_markdown
            post.cover_image_url = params.payload.cover_image_url

            post.liked_by_count = post.liked_by_count ?? 0
            post.published_on = (new Date()).toString()
            post.number_of_comments = post.number_of_comments ?? 0
            post.show_in_discover = params.payload.show_in_discover
            post.tags = params.payload.tags

            await postModelRepository.save(post)
            const instance: PostModel = (post.toRedisJson() as any)
            const data = {
                ...instance,
                desc_mini: post.desc_full_markdown.substring(0, 300),
                post_id: post.entityId,
            }

            return data
        },
        submitPostComment: async (_: any, params: MutationSubmitPostCommentArgs, ctx: ApolloContext): Promise<Omit<PostComment, "posted_by">> => {
            // auth required
            if (!ctx.user) throw new Error('auth required')

            const schema = yup.object().shape({
                comment: yup.string().required(),
                post_id: yup.string().required()
            })

            schema.validateSync(params.payload)

            // check that post is valid
            const postInstance = await postModelRepository.fetch(params.payload.post_id)
            if (!postInstance.creator_id) throw new Error(`Invalid postId: ${params.payload.post_id}`)

            postInstance.number_of_comments++;
            postModelRepository.save(postInstance)

            const instance = postCommentModelRepository.createEntity()
            instance.comment = params.payload.comment
            instance.posted_by_user_id = ctx.user.id
            instance.post_id = params.payload.post_id
            instance.commented_at = (new Date()).toISOString()

            await postCommentModelRepository.save(instance)

            return {
                ...(instance.toRedisJson() as PostCommentModel),
                comment_id: instance.entityId
            }
        },
        togglePostLike: async (_: any, params: MutationTogglePostLikeArgs, { user }: ApolloContext) => {
            if (!user) throw new Error('auth required')

            const instance = await postLikeModelRepository.search().where('user_id').equal(user.id).where('post_id').equal(params.post_id).return.first()

            const post = await postModelRepository.fetch(params.post_id)
            if (!post.creator_id) throw new Error('invalid post id')

            if (instance) {
                // remove instance
                post.liked_by_count--;
                await postModelRepository.save(post)

                await postLikeModelRepository.remove(instance.entityId)
                return false; // now we're not liking the post
            } else {
                post.liked_by_count++;
                await postModelRepository.save(post)

                // we should've checked for validity of post_id; but who cares?
                await postLikeModelRepository.createAndSave({
                    user_id: user.id,
                    liked_at: new Date(),
                    post_id: params.post_id,
                })
                return true;
            }

        },
        createOrEditEvent: async (_: any, params: MutationCreateOrEditEventArgs, { user }: ApolloContext): Promise<EventWithoutOrganizerType> => {
            if (!user) throw new Error('auth required')

            const schema = yup.object().shape({
                "show_in_discover": yup.bool().required(),
                "is_member_only_event": yup.bool().required(),
                "event_id": yup.string(),
                "title": yup.string().required().min(2).max(60),
                "event_start_time": yup.date().required(),
                "duration_in_minutes": yup.number().required().min(1),
                "cover_image_url": yup.string().url().required(),
                "location_type": yup.string().required().oneOf([EventLocationType.InPerson, EventLocationType.Virtual]),
                "desc_full_markdown": yup.string().required().min(10),
                "tags": yup.array().of(yup.string()).required(),
                "additional_info": yup.string(),
                "event_url": yup.string().url(),
                "address": yup.string()
            });
            schema.validateSync(params.payload)


            if (params.payload.location_type === EventLocationType.InPerson && !params.payload.address) {
                throw new Error('address is required for in person events')
            } else if (params.payload.location_type === EventLocationType.Virtual && !params.payload.event_url) {
                throw new Error('virtual url is required for virtual events')
            }

            // checking that all tags are correct!
            if (params.payload.tags.length) {
                const tagsSearch = await eventTagModelRepository.searchRaw(`@label_aka_value:(${(params.payload.tags).join('|')})`).return.all()
                if (tagsSearch.length !== params.payload.tags.length) {
                    throw new Error('Invalid tags')
                }
            }


            if (params.payload.is_member_only_event && params.payload.show_in_discover) {
                throw new Error('Member only events cannot be shown in discover')
            }

            let event = eventModelRepository.createEntity()
            if (params.payload.event_id) {
                event = await eventModelRepository.fetch(params.payload.event_id)
                if (event.organizer_id !== user.id) throw new Error('Invalid Id or permissions')
            }

            event.show_in_discover = params.payload.show_in_discover
            event.is_member_only_event = params.payload.is_member_only_event
            event.title = params.payload.title
            event.event_start_time = params.payload.event_start_time
            event.duration_in_minutes = params.payload.duration_in_minutes
            event.cover_image_url = params.payload.cover_image_url
            event.location_type = params.payload.location_type
            event.desc_full_markdown = params.payload.desc_full_markdown
            event.number_of_registrations = event.number_of_registrations ?? 0
            event.tags = params.payload.tags
            event.organizer_id = user.id
            event.additional_info = params.payload.additional_info
            event.address = params.payload.address ?? null
            event.event_url = params.payload.event_url ?? null



            event.posted_on = event.posted_on ?? (new Date()).toString()


            await eventModelRepository.save(event)


            const instance: EventModelType = (event.toRedisJson() as any)

            return {
                ...instance,
                event_id: event.entityId,
            }

        },
        registerForEvent: async (_: any, params: MutationRegisterForEventArgs, { user }: ApolloContext): Promise<Mutation['registerForEvent']> => {
            if (!user) throw new Error('auth required')

            // checking that the eventId is valid
            const eventInstance = await eventModelRepository.fetch(params.event_id)
            if (!eventInstance.organizer_id) throw new Error(`Invalid event_id: ${params.event_id}`)

            if (user.id === eventInstance.organizer_id) throw new Error('You are organizer of this event')

            const instance = await eventRegisteredMemberModelRepository.search().where('member_wall_id').equal(user.id).where('event_id').equal(params.event_id).return.first()
            if (instance) throw new Error('You are already registered for this event')

            // check if it's a member only event
            if (eventInstance.is_member_only_event) {
                const memberInstance = await userFollowerModelRepository.search()
                    .where('follower_id').equal(user.id).return.first()
                if (!memberInstance) throw new Error('This is a member only event. Please become a member to join the event.')
            }

            await eventRegisteredMemberModelRepository.createAndSave({
                member_wall_id: user.id,
                event_id: params.event_id,
                registered_at: (new Date()).toISOString()
            })

            eventInstance.number_of_registrations++; // incrementing number of registrations
            await eventModelRepository.save(eventInstance)

            return true;
        },
        toggleFollowAUser: async (_: any, params: MutationToggleFollowAUserArgs, { user }: ApolloContext): Promise<Mutation['toggleFollowAUser']> => {
            if (!user) throw new Error('auth required')

            if(user.id===params.wall_id) throw new Error('You cannot follow yourself')

            const userInstance = await userModelRepository.fetch(params.wall_id)
            if (!userInstance) throw new Error('Invalid user_id')

            const instance = await userFollowerModelRepository.search().where('follower_id').equal(user.id).where('creator_id').equal(params.wall_id).return.first()
            if(!instance){
                // crete new instance
                await userFollowerModelRepository.createAndSave({
                    follower_id: user.id,
                    creator_id: params.wall_id,
                    created_at: (new Date()).toISOString()
                })
                return true;
            }else{
                // delete instance
                await userFollowerModelRepository.remove(instance.entityId)
                return false;
            }

        }
    },
    Post: {
        comments: async (parent: PostWithoutCommentsAndCreatorInfoType, _: any, ctx: ApolloContext): Promise<PostCommentWithoutPostedByType[]> => {
            // fetch comments
            const comments = await postCommentModelRepository.search().where('post_id').equal(parent.post_id).sortDesc('commented_at').page(0, 3)
            return comments.map(e => ({
                ...(e.toRedisJson() as PostCommentModel),
                comment_id: e.entityId
            })).reverse()
        },
        creator_info: async (parent: PostWithoutCommentsAndCreatorInfoType, _: any, ctx: ApolloContext): Promise<UserPublicInfo> => resolveUserPublicInfoFromId(parent.creator_id)
    },
    PostComment: {
        posted_by: async (parent: Omit<PostComment, "posted_by">, _: any, ctx: ApolloContext): Promise<UserPublicInfo> => resolveUserPublicInfoFromId(parent.posted_by_user_id)
    },

    Event: {
        organizer: async (parent: EventWithoutOrganizerType, _: any, ctx: ApolloContext): Promise<UserPublicInfo> => resolveUserPublicInfoFromId(parent.organizer_id)
    }
}
