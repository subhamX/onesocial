import { gql, useQuery } from '@apollo/client';
import { BookOpenIcon, ChatBubbleBottomCenterIcon, HeartIcon } from '@heroicons/react/24/solid'
import Link from 'next/link';
import { useState } from 'react';
import { DETAILED_POST } from '../../config/ScreenRoutes';
import { Query, QueryGetPostsInWallArgs } from '../../graphql/generated_graphql_types';


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

    const { data, fetchMore, loading: isPostsLoading } = useQuery<{ getPostsInWall: Query['getPostsInWall'] }, QueryGetPostsInWallArgs>(getPostsInWall, {
        variables: {
            offset: 0,
            limit: 10,
            wall_id: userId
        },
        skip: (!userId),
        fetchPolicy: 'cache-and-network',
        onCompleted(data) {
            if (data.getPostsInWall.length < 10) setHasMore(false)
        }
    })

    const [hasMore, setHasMore] = useState(true)
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
                                <Link href={DETAILED_POST(post.post_id)} key={indx}>
                                    <div className='border py-8 my-3 px-6 grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-10 cursor-pointer hover:bg-base-200'>

                                        <div className='sm:col-span-3 break-words'>
                                            <div className="font-extrabold text-xl">
                                                {post.title}
                                            </div>

                                            <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                                                {new Date(parseFloat(post.published_on) * 1000).toDateString()}


                                                <BookOpenIcon className='w-6' />
                                                {post.approx_read_time_in_minutes} min read

                                            </div>

                                            <div className="text-xs text-gray-500 pt-3 pb-4">
                                                {post.desc_mini}
                                            </div>


                                            <div className="flex gap-5 text-2xs">
                                                <div className='flex text-pink-400 flex-col justify-center items-center'>
                                                    <HeartIcon className='w-5' />
                                                    {post.liked_by_count}
                                                </div>
                                                <div className="flex flex-col text-blue-400 justify-center items-center">
                                                    <ChatBubbleBottomCenterIcon className='w-5' />
                                                    {post.number_of_comments}
                                                </div>
                                            </div>
                                        </div>


                                        <img src={post.cover_image_url} className='sm:col-span-2 flex-grow w-full h-40 object-cover sm:w-64 rounded-lg border border-blue-200' />

                                    </div>
                                </Link>
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
