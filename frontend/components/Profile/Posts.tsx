import { gql, useQuery } from '@apollo/client';
import { BookOpenIcon, ChatBubbleBottomCenterIcon, HeartIcon } from '@heroicons/react/24/solid'
import Link from 'next/link';
import { useState } from 'react';
import { DETAILED_POST } from '../../config/ScreenRoutes';
import { Post, Query, QueryGetPostsInWallArgs } from '../../graphql/generated_graphql_types';
import { PostUI } from './PostUI';


// type Props = {
//     posts: {
//         post_id: string;
//         owner_id: string;
//         title: string,
//         except: string, // not body; less than or equal to 250 chars
//         published_on: string, // date
//         liked_by: number,
//         number_of_comments: number;
//         cover_image_url: string,
//         approx_read_time_in_minutes: number
//     }[],
//     isPostsLoading: boolean
// }


export const getPostsInWall = gql`

query getPostsInWall($offset: Int!, $limit: Int!, $wall_id: String!) {
  getPostsInWall(offset: $offset, limit: $limit, wall_id: $wall_id) {
    approx_read_time_in_minutes
    cover_image_url
    published_on
    title
    post_id
    number_of_comments
    liked_by_count
    desc_mini
    creator_id

    creator_info {
      avatar_url
      name
      user_id
    }
    tags
  }
}


`

// TODO: Pagination?
// I think pagination will be added in the controller. This is just UI logic
export const Posts = ({ userId }: { userId: string }) => {
    const [hasMore, setHasMore] = useState(true)

    const { data, fetchMore, loading: isPostsLoading } = useQuery<{ getPostsInWall: Query['getPostsInWall'] }, QueryGetPostsInWallArgs>(getPostsInWall, {
        variables: {
            offset: 0,
            limit: 10,
            wall_id: userId
        },
        skip: (!userId),
        fetchPolicy: 'no-cache',
        onCompleted(data) {
            if (data.getPostsInWall.length < 10) setHasMore(false)
        }
    })

    const posts = data?.getPostsInWall


    return (
        <div className="max-w-4xl mx-auto px-4">
            {(!data && isPostsLoading) ?
                <div className="alert max-w-3xl my-2 mx-auto alert-info">Crunching latest posts... ⟨䷄⟩</div>
                :
                <>

                    {posts?.length === 0 ? <div className="alert max-w-3xl my-2 mx-auto alert-info">No posts yet!</div> :

                        <>

                            {posts?.map((post, indx) => (
                                <PostUI key={indx} post={post} />
                            ))}


                            <div className='mb-10'>
                                {hasMore ? <button className="btn btn-primary" onClick={() => fetchMore({
                                    variables: {
                                        offset: (data?.getPostsInWall.length ?? 0),
                                        limit: 10,
                                        wall_id: userId
                                    },

                                }).then(e => {
                                    if (e.data.getPostsInWall.length < 10) setHasMore(false);
                                })}>Load more...</button> : <div className='alert font-black text-gray-500 flex text-sm justify-center'>That&apos;s the end.. 🎉</div>}
                            </div>
                        </>}

                </>
            }

        </div>
    )
}


