import { Form, Formik } from "formik";
import { FormInputField } from "./Forms/FormInputField";
import dayjs from "dayjs";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Mutation, MutationSubmitPostCommentArgs, PostComment, Query, QueryGetPostInfoByIdArgs, UserInstance } from "../graphql/generated_graphql_types";
import { useState } from "react";
import { GET_CURRENT_USER } from "../graphql/queries/getCurrentUser";
import { toast } from "react-toastify";
import { getErrorMessageFromApolloError } from "../utils/getErrorMessageFromApolloError";
import { getPostInfoById } from "../graphql/queries/getPostInfoById";




export const getPostComments = gql`

query($offset: Int!, $limit: Int!, $post_id: String!){
  getPostComments(offset: $offset, limit: $limit, post_id: $post_id) {
    comment
    comment_id
    post_id
    commented_at
    posted_by {
      avatar_url
      name
      user_id
    }
  }
}

`




export const submitPostComment = gql`

mutation($payload: PostCommentInput!){
  submitPostComment(payload: $payload) {
    comment
    comment_id
    post_id
    commented_at
    posted_by {
      avatar_url
      name
      user_id
    }
    posted_by_user_id
  }
}

`

export const noAuthUserDefaultAvatar = "https://unsplash.com/photos/wQLAGv4_OYs/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MjB8fHVzZXIlMjBwcm9maWxlJTIwYWJzdHJhY3R8ZW58MHx8fHwxNjYwNTkxNzY2&force=true&w=100"




export const PostCommentsComponent = ({ postId }: { postId: string; }) => {
    // fetch user
    const { loading: userDataLoading, data: user } = useQuery<{ getCurrentUser: UserInstance; }>(GET_CURRENT_USER, {
        fetchPolicy: 'cache-only'
    });


    const [hasMore, setHasMore] = useState(true);

    // Add new comment mutation
    const [commentMutateFunx] = useMutation<{ submitPostComment: Mutation['submitPostComment']; }, MutationSubmitPostCommentArgs>(submitPostComment, {
        update(cache, { data }) {
            if (data?.submitPostComment) {
                cache.modify({
                    fields: {
                        getPostComments(existingPostComments = []) {
                            const newCommentRef = cache.writeFragment({
                                data: data.submitPostComment,
                                fragment: gql`
                                  fragment NewPostComment on PostComment {
                                    comment_id
                                    post_id
                                    __typename
                                }`
                            });
                            return [...existingPostComments, newCommentRef];
                        },
                    },
                });

                // Updating the comments count
                const post = cache.readQuery<{getPostInfoById: Query['getPostInfoById'], authUserPostState: Query['authUserPostState'] }, QueryGetPostInfoByIdArgs>(
                    { query: getPostInfoById, variables: { post_id: data.submitPostComment.post_id } },
                )

                if (post) {
                    cache.writeQuery<{getPostInfoById: Query['getPostInfoById'], authUserPostState: Query['authUserPostState'] }>({
                        data: {
                            getPostInfoById: {
                                ...(post.getPostInfoById),
                                number_of_comments: post.getPostInfoById.number_of_comments + 1,
                            },
                            authUserPostState: post.authUserPostState
                        },
                        query: getPostInfoById
                    })
                }

            }
        }
    });

    // fetch all comments query
    const { fetchMore, data: postCommentsData } = useQuery<{ getPostComments: PostComment[]; }>(getPostComments, {
        variables: {
            offset: 0,
            limit: 3,
            post_id: postId
        },
        skip: (!postId),
        onCompleted(data) {
            if (data.getPostComments.length < 3)
                setHasMore(false);
        },
    });


    const postCommentHandler = async (newCommentVal: string, resetForm: () => void) => {
        commentMutateFunx({
            variables: {
                payload: {
                    comment: newCommentVal,
                    post_id: postId
                }
            },
            onCompleted() {
                resetForm();
            },
            onError(error) {
                console.log(error);
                toast(getErrorMessageFromApolloError(error), { type: 'error' });
            }
        });
    };


    return (
        <div className="bg-base-200 mb-10">
            <div className="p-5">
                {hasMore && <div className="text-gray-400 font-bold text-xs cursor-pointer mb-4" onClick={() => {
                    fetchMore({
                        variables: {
                            offset: postCommentsData?.getPostComments.length ?? 0,
                            limit: 3,
                            postId: postId
                        },
                    }).then(e => {
                        if (e.data.getPostComments.length < 3)
                            setHasMore(false);
                    });
                }}>Load previous comments...</div>}

                {postCommentsData && (postCommentsData.getPostComments).map((e, indx) => (
                    <div className="text-sm mt-2 mb-5" key={indx}>
                        <div className="flex items-center gap-5">
                            <div className="avatar">
                                <div className="w-10 rounded-full">
                                    <img src={e.posted_by.avatar_url} />
                                </div>
                            </div>
                            <div className="bg-base-100 rounded py-2 px-3">
                                <div className="font-medium space-x-2"><span>{e.posted_by.name}</span> <span className="text-gray-500 text-xs">{dayjs(parseFloat(e.commented_at) * 1000).fromNow()}</span></div>
                                <div className="text-gray-500">{e.comment}</div>
                            </div>
                        </div>
                    </div>
                ))}


                <Formik
                    onSubmit={(e, { resetForm }) => {
                        if (user?.getCurrentUser) {
                            // user is logged in
                            postCommentHandler(e.new_comment, resetForm);
                        }
                    }} initialValues={{ new_comment: '' }}>
                    <Form>
                        <div className="flex gap-5 h-10 items-center">
                            <div className="avatar">
                                <div className="w-10 rounded-full">
                                    <img src={user?.getCurrentUser?.avatar_url ?? noAuthUserDefaultAvatar} />
                                </div>
                            </div>

                            <FormInputField required fieldId="new_comment" disabled={user?.getCurrentUser === null} placeholder={user?.getCurrentUser === null ? "Please login to post a comment. 🙃" : "Add comment..."} />
                            <button className="btn btn-primary btn-sm h-full">Submit</button>
                        </div>
                    </Form>

                </Formik>
            </div>
        </div>
    );

};
