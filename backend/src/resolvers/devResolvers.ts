import { postTagModelRepository } from "../db/PostTagModel";
import { ApolloContext } from "../types/ApolloContext";
import { Mutation, MutationCreateOrEditPostArgs, MutationSubmitPostCommentArgs, MutationTogglePostLikeArgs, Post, PostComment, Query, QueryGetPostCommentsArgs, QueryGetPostInfoByIdArgs, QueryGetPostsInWallArgs, QueryGetPostTagsArgs, UserPublicInfo } from "../generated_graphql_types";
import { PostModel, postModelRepository } from "../db/PostModel";
import * as yup from 'yup'
import { PostCommentModel, postCommentModelRepository } from "../db/CommentModel";
import { UserModel, userModelRepository } from "../db/UserModel";
import { postLikeModelRepository } from "../db/PostLikeModel";


type PostWithoutCommentsAndCreatorInfoType = Omit<Mutation['createOrEditPost'], 'comments' | 'creator_info'>
type PostCommentWithoutPostedByType = Omit<PostComment, 'posted_by'>


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
                "title": yup.string().required().min(2).max(30),
                "tags": yup.array().of(yup.string()).required()
            })

            shape.validateSync(params.payload)

            // TODO: check that all tags are correct!


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
    }
}
