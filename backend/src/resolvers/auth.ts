import { userModelRepository } from "../db/UserModel";
import { Query, UserInstance } from "../generated_graphql_types"
import { ApolloContext } from "../types/ApolloContext"



export const authResolver = {
    Query: {
        getCurrentUser: async (_: any, __: any, ctx: ApolloContext): Promise<Query['getCurrentUser']> => {
            if (ctx.user) {
                const userInstance = await userModelRepository.search().where('id').eq(ctx.user.id).return.first()
                if (userInstance) {
                    return {
                        avatar_url: userInstance.avatar_url,
                        email: userInstance.email,
                        id: userInstance.id,
                        is_google_account_connected: userInstance.is_google_account_connected,
                        name: userInstance.name,
                        twitter_user_name: userInstance.twitter_user_name
                    };
                }
            }

            return null;
        },
    },
}
