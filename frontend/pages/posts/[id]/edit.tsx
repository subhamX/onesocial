import { withAuth } from "../../../authGuards/withAuth"
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import { CreateOrEditPostInput, Post, Query, QueryGetPostInfoByIdArgs } from "../../../graphql/generated_graphql_types"
import { gql, useMutation, useQuery } from "@apollo/client"
import { createOrEditPost } from "../../../graphql/queries/createOrEditPost"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { DETAILED_POST } from "../../../config/ScreenRoutes"
import { getErrorMessageFromApolloError } from "../../../utils/getErrorMessageFromApolloError"
import { CreateOrEditPostForm } from "../../../components/CreateOrEditPostForm"
import { MainSiteNavbar } from "../../../components/Navbar.tsx/MainSiteNavbar";
import { Loading } from "../../../components/Commons/Loading";



const gqlQuery = gql`

query($post_id: String!){
  getPostInfoById(post_id: $post_id) {
    approx_read_time_in_minutes
    cover_image_url
    published_on
    title
    show_in_discover
    published_on
    post_id
    number_of_comments
    liked_by_count
    desc_mini
    creator_id
    desc_full_markdown
    creator_info {
      avatar_url
      name
      user_id
    }
    tags
  }
}


`

const EditPost = () => {
    // TODO: fetch tags
    const router = useRouter()

    const postId = router.query.id as string

    const [mutateFunction] = useMutation<{ createOrEditPost: Post }, { payload: CreateOrEditPostInput }>(createOrEditPost)


    const { loading, data } = useQuery<{ getPostInfoById: Query['getPostInfoById'] }, QueryGetPostInfoByIdArgs>(gqlQuery, {
        variables: {
            post_id: postId
        },
    });

    const handlePostCreation = async (val: any) => {
        mutateFunction({
            variables: {
                payload: {
                    cover_image_url: val.cover_image_url,
                    desc_full_markdown: val.desc_full_markdown,
                    show_in_discover: val.show_in_discover,
                    tags: val.tags.map((e: any) => e.value),
                    title: val.title,
                    post_id: postId
                    // TODO: update?
                }
            },
            onError(error) {
                toast(getErrorMessageFromApolloError(error), { type: 'error' })

            },
            onCompleted(data) {
                router.push(DETAILED_POST(data.createOrEditPost.post_id))
            },
        })
    }

    return (
        <>
            <MainSiteNavbar />


            {loading || !data ?
                <Loading text="Loading..." />
                :
                <CreateOrEditPostForm
                    initialValues={{
                        ...(data.getPostInfoById),
                        tags: data.getPostInfoById.tags.map(e => ({label: e, value: e}))
                    }}
                    handleSubmit={handlePostCreation}
                />
            }
        </>
    )
}

export default withAuth(EditPost)







