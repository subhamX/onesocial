import { BookOpenIcon, ChatAltIcon, HeartIcon } from '@heroicons/react/solid'
import Link from 'next/link';
import { DETAILED_POST } from '../../config/ScreenRoutes';


type Props = {
    posts: {
        post_id: string;
        owner_id: string;
        title: string,
        except: string, // not body; less than or equal to 250 chars
        published_on: string, // date
        liked_by: number,
        number_of_comments: number;
        cover_image_url: string,
        approx_read_time_in_minutes: number
    }[],
    isPostsLoading: boolean
}

// TODO: Pagination?
// I think pagination will be added in the controller. This is just UI logic
export const Posts = ({ posts, isPostsLoading }: Props) => {
    return (
        <div className="my-3 max-w-5xl mx-auto px-4">
            {isPostsLoading ?
                <div className="alert max-w-3xl my-2 mx-auto alert-info">Crunching latest posts... ⟨䷄⟩</div>
                :
                <>

                    {posts.length === 0 && <div className="alert max-w-3xl my-2 mx-auto alert-info">No posts yet!</div>}

                    {posts.map((post, indx) => (
                        <Link href={DETAILED_POST(post.post_id)} key={indx}>
                            <div className='border py-10 my-3 px-6 grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-10 border-black cursor-pointer hover:bg-red-50'>

                                <div className='sm:col-span-3'>
                                    <div className="font-extrabold text-2xl">
                                        {post.title}
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-400 pt-1">
                                        {new Date(post.published_on).toDateString()}


                                        <BookOpenIcon className='w-6' />
                                        {post.approx_read_time_in_minutes} min read

                                    </div>

                                    <div className="text-sm text-gray-500 pt-3 pb-4">
                                        {post.except}
                                    </div>


                                    <div className="flex gap-5  text-xs">
                                        <div className='flex text-pink-400 flex-col justify-center items-center'>
                                            <HeartIcon className='w-6' />
                                            {post.liked_by}
                                        </div>
                                        <div className="flex flex-col text-blue-400 justify-center items-center">
                                            <ChatAltIcon className='w-6' />
                                            {post.number_of_comments}
                                        </div>
                                    </div>
                                </div>


                                <img src={post.cover_image_url} className='flex-grow h-40 w-full' />

                            </div>

                        </Link>
                    ))}


                </>
            }

        </div>
    )
}
