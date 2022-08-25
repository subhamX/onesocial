import { gql, useMutation, useQuery } from "@apollo/client";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { Field, FieldArray, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { Loading } from "../../../../components/Commons/Loading";
import { MainSiteNavbar } from "../../../../components/Navbar.tsx/MainSiteNavbar";
import { DASHBOARD_URL, DETAILED_LISTING, POST_ADD_LISTING_PRODUCT_ITEMS } from "../../../../config/ScreenRoutes";
import { ListingProductItem, ListingType, Mutation, MutationDeleteListingProductItemArgs, MutationEditListingProductItemsMetaDataArgs, MutationPublishProductListingArgs, Query, QueryGetListingInfoByIdArgs } from "../../../../graphql/generated_graphql_types";
import { getErrorMessageFromApolloError } from "../../../../utils/getErrorMessageFromApolloError";



const getListingInfoByIdOnlyProducts = gql`

query($listing_id: String!){
  getListingInfoById(listing_id: $listing_id) {
    id
    name
    number_of_product_items
    listing_type
    product_items {
      description
      file_name
      id
      listing_id
    }
    is_published
  }
}
`

const editListingProductItemsMetaData = gql`

mutation editListingProductItemsMetaData($payload: EditListingProductItemsMetaData!){
  editListingProductItemsMetaData(payload: $payload) {
    description
    file_name
    id
    listing_id
  }
}

`

const deleteListingProductItem = gql`
mutation deleteListingProductItem($listing_product_id: String!){
  deleteListingProductItem(listing_product_id: $listing_product_id)
}
`

const publishProductListing = gql`

mutation publishProductListing($listing_id: String!){
    publishProductListing(listing_id: $listing_id)
}
`

const ManageContent = () => {

    const router = useRouter()
    const listingId = router.query.id as string;

    const [isUploading, setIsUploading] = useState(false);


    const { loading, data, refetch } = useQuery<Query, QueryGetListingInfoByIdArgs>(getListingInfoByIdOnlyProducts, {
        variables: {
            listing_id: listingId
        },
        skip: !listingId,
        onError(error) {
            toast.error(getErrorMessageFromApolloError(error))
            router.push(DASHBOARD_URL)
            return
        },
    })

    const [updateMetadataMutateFunction] = useMutation<Mutation['editListingProductItemsMetaData'], MutationEditListingProductItemsMetaDataArgs>(editListingProductItemsMetaData)
    const [deleteFileMutationFunction] = useMutation<Mutation['deleteListingProductItem'], MutationDeleteListingProductItemArgs>(deleteListingProductItem);
    const [publishProductListingMutationFunction] = useMutation<Mutation['publishProductListing'], MutationPublishProductListingArgs>(publishProductListing);

    const handleFileUpload = async (ev: ChangeEvent<HTMLInputElement>) => {
        try {
            const files = ev.target.files;
            if (!files) return;

            if (files.length > 10) {
                alert('You can upload at max 10 files. Consider bundling them into a zip maybe?.')
                return;
            }
            setIsUploading(true)

            // upload these <=10 files
            const formData = new FormData()
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i])
            }

            formData.append('listing_id', listingId)

            console.log(formData)

            const response = await fetch(POST_ADD_LISTING_PRODUCT_ITEMS, {
                method: 'POST',
                body: formData
            })
            const json = await response.json()
            if (json.error) {
                throw new Error(json.message)
            }

            refetch()

        } catch (err: any) {
            toast.error(err.message)
        }
        setIsUploading(false)
    }

    console.log(data)

    const productData = data?.getListingInfoById

    if (productData?.listing_type === ListingType.Service) {
        toast.error("This listing is a service listing. It doesn't have any content.")
        router.push(DETAILED_LISTING(productData.listing_type, productData.id))
        return null;
    }

    const handleSubmit = (values: {
        productItems: ListingProductItem[];
    }) => {
        console.log(values)
        // TODO: make a gql query to upload metadata of uploads
        updateMetadataMutateFunction({
            variables: {
                payload: {
                    items: values.productItems.map(e => ({
                        description: e.description,
                        file_name: e.file_name,
                        id: e.id,
                    })),
                    listing_id: listingId
                }
            },
            onCompleted(data) {
                toast.success('Product items updated successfully')
            },
            onError(error) {
                toast.error(getErrorMessageFromApolloError(error))
            },
        })
    }

    const handleListingProductDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this product item?')) {
            deleteFileMutationFunction({
                variables: {
                    listing_product_id: id
                },
                onCompleted(data) {
                    toast.success('Product item deleted successfully')
                    refetch()
                },
                onError(error) {
                    toast.error(getErrorMessageFromApolloError(error))
                }
            })
        }
    }


    const handlePublish = () => {
        if (productData?.number_of_product_items === 0) {
            alert('please add at least one item before publishing')
        } else if (productData) {
            publishProductListingMutationFunction({
                variables: {
                    listing_id: listingId
                },
                onCompleted(data) {
                    toast.success('Product listing published successfully')
                    router.push(DETAILED_LISTING(productData.listing_type, productData.id))
                },
                onError(error) {
                    toast.error(getErrorMessageFromApolloError(error))
                },
            });
        }
    }

    return (
        <div>

            <MainSiteNavbar />


            <div className="max-w-3xl mx-auto mt-5 mb-10 px-5">
                <h1 className="font-black text-2xl pb-1 mb-4">Manage Content</h1>

                {loading && <Loading text='Loading product items' />}

                {productData?.name && <div>
                    <div className="font-semibold text-base">Product Offering Name:</div>
                    <div className="font-extrabold text-lg pb-1 mb-4">{productData.name}</div>
                </div>}

                {productData?.number_of_product_items !== undefined && <div>
                    <div className="font-semibold text-base">Number of product items:</div>
                    <h2 className="font-extrabold text-lg pb-1 mb-4">{productData.number_of_product_items}</h2>
                </div>}


                {!!productData?.product_items.length && <Formik onSubmit={handleSubmit} enableReinitialize initialValues={{ productItems: productData?.product_items ?? [] }}>

                    {({ values, dirty }) => (
                        <>

                            <Form className="mb-7 flex flex-col">

                                <FieldArray
                                    name='productItems'

                                    render={arrayHelpers => (

                                        <>

                                            {values.productItems.map((e, indx) => {
                                                return (
                                                    <div key={e.id} className='relative text-sm bg-gray-100 py-5 my-2 px-3 border rounded-md items-center gap-5 flex flex-col sm:flex-row w-full'>

                                                        <div className="avatar">
                                                            <div className="w-16 h-fit rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                                <img src="https://unsplash.com/photos/hoS3dzgpHzw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8cHJvZHVjdCUyMGFic3RyYWN0fGVufDB8fHx8MTY2MTMzNjAyMg&force=true&w=640" />
                                                            </div>
                                                        </div>

                                                        <div className="w-full">
                                                            <label className='input-group my-2 flex-col sm:flex-row'>
                                                                <div className="label justify-start font-black gap-1 w-full pb-1">File Name</div>
                                                                <Field
                                                                    name={`productItems.${indx}.file_name`}
                                                                    type='text'
                                                                    id={`productItems.${indx}.file_name`}
                                                                    autoComplete="off"
                                                                    placeholder="Name of the file"
                                                                    className="input h-8 input-bordered px-3 text-sm font-medium border-black bg-slate-50 w-full"
                                                                />
                                                            </label>

                                                            <label className='input-group my-2 flex-col sm:flex-row'>
                                                                <div className="label justify-start font-black gap-1 w-full pb-1">Description</div>
                                                                <Field
                                                                    name={`productItems.${indx}.description`}
                                                                    type='text'
                                                                    id={`productItems.${indx}.description`}
                                                                    autoComplete="off"
                                                                    placeholder="It it's a markdown file containing how to run the code"
                                                                    className="input h-8 input-bordered px-3 text-sm font-medium border-black bg-slate-50 w-full"
                                                                />
                                                            </label>
                                                        </div>

                                                        <button className="absolute right-3 -top-2 btn btn-accent text-accent-content btn-xs text-2xs" type="button" onClick={() => handleListingProductDelete(e.id)}>Delete</button>
                                                    </div>
                                                )
                                            })}

                                            {dirty && <>
                                                <div className="flex justify-end">
                                                    <button className="btn btn-primary btn-sm" type="submit">Save changes</button>
                                                </div>
                                            </>}

                                        </>

                                    )}
                                />

                            </Form>
                        </>
                    )}

                </Formik>}


                {productData?.product_items.length === 0 && <div className="alert alert-warning mb-4">No product items found for this listing. Let&apos;s upload some by clicking below</div>}


                <div className="flex justify-center text-center items-center w-full bg-gray-100 border rounded-xl max-w-lg mx-auto py-6 px-3">

                    {isUploading ?
                        <div className="flex justify-center gap-1 text-sm"><CloudArrowUpIcon className='w-6' />
                            <div> Uploading.. Please wait.</div>
                        </div>
                        :
                        <label
                            htmlFor="dropzone-file"
                            className="flex flex-col justify-center items-center w-full h-full rounded-lg border-dashed cursor-pointer "
                        >
                            <div className="flex flex-col justify-center items-center">
                                <svg
                                    aria-hidden="true"
                                    className="mb-3 w-10 h-10 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 ">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 px-1">
                                    Please select a file(s) to upload
                                </p>
                            </div>
                            <input id="dropzone-file" multiple onChange={handleFileUpload} type="file" className="hidden" />
                        </label>
                    }

                </div>

                {productData && (
                    <>
                        <div className="flex justify-end mt-4">
                            {!productData?.is_published ? <button className="btn btn-secondary" onClick={handlePublish}>Publish</button>
                                : <Link href={DETAILED_LISTING(productData.listing_type, productData.id)}>
                                <button className="btn btn-secondary">See Listing Public View</button></Link>
                                }
                        </div>
                    </>
                )}

            </div>

        </div>
    )

}

export default ManageContent;
