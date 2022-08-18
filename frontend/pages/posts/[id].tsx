import { PostsDetailedScreen } from "../../components/PostsDetailed"


const PostDetailed = () => (
    <PostsDetailedScreen
        isPostLoading={false}
        loadMoreCommentsHandler={() => {

        }}
        postCommentHandler={() => {

        }}
        post={{
            cover_image_url: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
            body: "Hi, I'm an author, writing books on this awesome world. Follow me to learn more about it. We're humans, and the thing which makes us human is our a...",
            liked_by: 120,
            number_of_comments: 16,
            owner_id: "10",
            post_id: "177171",
            published_on: "2022-08-16T10:46:26.261Z",
            title: "How to build the best spacecraft?",
            approx_read_time_in_minutes: 2,
            liked_by_me: false
        }}
        comments={[{
            comment: "Hey",
            is_deleted: false,
            name: "haha",
            posted_at: "2022-08-16T10:46:26.261Z",
            user_avatar: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
        },
        {
            comment: "Hey",
            is_deleted: false,
            name: "haha",
            posted_at: "2022-08-16T10:46:26.261Z",
            user_avatar: "https://unsplash.com/photos/gwE9vXSi7Xw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8OHx8YmFubmVyfGVufDB8fHx8MTY2MDY0NjcwOA&force=true&w=1920",
        }]}
    />
)


export default PostDetailed
