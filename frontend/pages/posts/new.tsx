import { withAuth } from "../../authGuards/withAuth"
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import { CreateOrEditPostInput, Post } from "../../graphql/generated_graphql_types"
import { useMutation } from "@apollo/client"
import { createOrEditPost } from "../../graphql/queries/createOrEditPost"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import { DETAILED_POST } from "../../config/ScreenRoutes"
import { getErrorMessageFromApolloError } from "../../utils/getErrorMessageFromApolloError"
import { CreateOrEditPostForm } from "../../components/CreateOrEditPostForm"
import { MainSiteNavbar } from "../../components/Navbar.tsx/MainSiteNavbar";


const NewPost = () => {
    // TODO: fetch tags
    const router = useRouter()

    const [mutateFunction] = useMutation<{ createOrEditPost: Post }, { payload: CreateOrEditPostInput }>(createOrEditPost)


    const handlePostCreation = async (val: any) => {
        console.log(val)
        mutateFunction({
            variables: {
                payload: {
                    cover_image_url: val.cover_image_url,
                    desc_full_markdown: val.desc_full_markdown,
                    show_in_discover: val.show_in_discover,
                    tags: val.tags.map((e: any) => e.value),
                    title: val.title,
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


       <CreateOrEditPostForm
            initialValues={{
                cover_image_url: "http://abc.com",
                title: "",
                desc_full_markdown: "",
                show_in_discover: true,
                tags: []
            }}
            handleSubmit={handlePostCreation}
        />
       </>
    )
}

export default withAuth(NewPost)







