import { BookOpenIcon,  HeartIcon } from "@heroicons/react/solid";
import { HeartIcon as HeartOutlineIcon, ChatAltIcon } from "@heroicons/react/outline";

import { Form, Formik } from "formik";
import { FormInputField } from "./Forms/FormInputField";
import { MainSiteNavbar } from "./Navbar.tsx/MainSiteNavbar";
import { UserProfileSiteLogo } from "./Navbar.tsx/UserProfileSiteLogo";


type CommentProp = {
    user_avatar: string,
    name: string,
    posted_at: string,
    comment: string,
    is_deleted: boolean,
}

type Props = {
    post: {
        title: string,
        body: string, // full markdown
        published_on: string, // date

        post_id: string;
        owner_id: string;

        liked_by: number,
        number_of_comments: number;
        cover_image_url: string,
        approx_read_time_in_minutes: number,

        liked_by_me: boolean,
    },
    isPostLoading: boolean
    loadMoreCommentsHandler: () => void,
    postCommentHandler: (comment: string) => void
    comments: CommentProp[]
}

export const PostsDetailedScreen = ({ post, isPostLoading, loadMoreCommentsHandler, comments, postCommentHandler }: Props) => {

    const togglePostLike = () => {
        // TODO: Graphql logic to toggle like
        // If the user is not logged in then put an alert to login
        const userLoggedIn=false
        if(!userLoggedIn){
            alert('Please login to ❤️ the post.')
            return
        }
    }
    return (
        <>
            <MainSiteNavbar leadingBlock={
                <UserProfileSiteLogo siteTitle={'heya'} />
            } />
            {isPostLoading ?
                <div className="alert max-w-3xl my-2 mx-auto alert-info">Fetching post... ⟨䷄⟩</div>
                :
                <div className="max-w-4xl mx-auto">
                    <img src={post.cover_image_url} className='flex-grow h-64 w-full' />
                    <div className="px-4">
                        <div className="text-4xl font-black my-5">{post.title}</div>

                        <div className="flex items-center gap-2 text-sm text-gray-400 pt-1">
                            {new Date(post.published_on).toDateString()}


                            <BookOpenIcon className='w-6' />
                            {post.approx_read_time_in_minutes} min read

                        </div>

                        <div className="text-sm text-gray-500 pt-3 pb-4">
                            TODO: Render markdown
                            {post.body}
                        </div>


                        <div className="flex gap-5  text-sm mb-7">
                            <button onClick={togglePostLike} className='btn btn-circle btn-ghost flex text-pink-400 flex-col justify-center items-center'>
                                {post.liked_by_me ?
                                    <HeartIcon className="w-7" />
                                    : <HeartOutlineIcon className='w-7' />
                                }
                                {post.liked_by}
                            </button>
                            <div className="flex flex-col text-blue-400 justify-center items-center">
                                <ChatAltIcon className='w-7' />
                                {post.number_of_comments}
                            </div>
                        </div>
                        <CommentsUI hasMore postCommentHandler={postCommentHandler} comments={comments} loadMoreCommentsHandler={loadMoreCommentsHandler} />

                    </div>

                </div>
            }


        </>
    )
}


const CommentsUI = ({ comments, hasMore, postCommentHandler, loadMoreCommentsHandler }: { comments: CommentProp[], hasMore: boolean, loadMoreCommentsHandler: () => void, postCommentHandler: (comment: string) => void }) => {
    // fetch user


    const userAvatar = "https://unsplash.com/photos/wQLAGv4_OYs/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MjB8fHVzZXIlMjBwcm9maWxlJTIwYWJzdHJhY3R8ZW58MHx8fHwxNjYwNTkxNzY2&force=true&w=100"
    const isLoggedIn = true

    return (
        <div className="bg-base-200">
            <div className="p-5">
                {hasMore && <div className="text-gray-400 font-bold text-xs cursor-pointer" onClick={loadMoreCommentsHandler}>Load previous comments...</div>}

                {comments.map((e, indx) => (
                    <div className="text-sm mt-2 mb-5" key={indx}>
                        <div className="flex items-center gap-5">
                            <div className="avatar">
                                <div className="w-10 rounded-full">
                                    <img src={e.user_avatar} />
                                </div>
                            </div>
                            <div className="bg-base-100 rounded py-2 px-3">
                                <div className="font-medium space-x-2"><span>{e.name}</span> <span className="text-gray-500 text-xs">{new Date(e.posted_at).toDateString()}</span></div>
                                <div className="text-gray-500">{e.comment}</div>
                            </div>
                        </div>
                    </div>
                ))}


                <Formik onSubmit={(e) => postCommentHandler(e.new_comment)} initialValues={{ new_comment: '' }}>
                    <Form>
                        <div className="flex gap-5 h-10 items-center">
                            <div className="avatar">
                                <div className="w-10 rounded-full">
                                    <img src={userAvatar} />
                                </div>
                            </div>
                            <FormInputField required fieldId="new_comment" placeholder="Add comment..." />
                            <button className="btn btn-primary btn-sm h-full"  >Submit</button>
                        </div>
                    </Form>

                </Formik>
            </div>
        </div>
    )

}
