import { Field, Form, Formik, useFormikContext } from "formik"
import { ChangeEvent, ChangeEventHandler, useState } from "react"
import { MDEditorWrapper } from "./MDEditorWrapper"
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { EyeIcon, PencilSquareIcon as PencilAltIcon } from "@heroicons/react/24/outline";
import { ListingType, PriceCurrency, Query } from "../graphql/generated_graphql_types";
import { CoverImageUpload } from "./CoverImageUpload";
import { FormMultiSelectAsyncField } from "./Forms/FormMultiSelectAsyncField";
import { apolloClient } from "../graphql";
import { getListingTags } from "../graphql/queries/getListingTags";


const listingTypes = {

    [ListingType.DigitalProduct]: [
        {
            logo: "https://img.icons8.com/color/48/000000/notion.png",
            name: "Notion Templates",
            description: "Offer your notion template and make the lives of your users easier.",
            includes_video_call_support: false,
            includes_chat_support: false

        },
        {
            logo: "https://img.icons8.com/color/48/000000/figma.png",
            name: "Figma Designs",
            description: "Offer your beautiful design illustrations",
            includes_video_call_support: false,
            includes_chat_support: false
        },
        {
            logo: "https://img.icons8.com/color/48/000000/home.png",
            name: "EBook",
            description: "Offer your manga and ebooks",
            includes_video_call_support: false,
            includes_chat_support: false
        },
    ],
    [ListingType.Service]: [
        {
            logo: "https://img.icons8.com/color/48/000000/laptop.png",
            name: "Video Consulting",
            description: "Use your domain expertise to solve the problem of the users.",
            includes_video_call_support: true,
            includes_chat_support: true
        },
        {
            logo: "https://img.icons8.com/color/48/000000/chat.png",
            name: "QnA",
            description: "Let the user ask you a question and get a response.",
            includes_video_call_support: false,
            includes_chat_support: true
        },
        {
            logo: "https://img.icons8.com/color/48/000000/resume.png",
            name: "Resume Reviews",
            description: "Review resumes and provide feedback candidates on how to improve them.",
            includes_video_call_support: false,
            includes_chat_support: true
        },
        {
            logo: "https://img.icons8.com/color/48/000000/interview.png",
            name: "Mock Interview",
            description: "Help the user prepare for an interview",
            includes_video_call_support: true,
            includes_chat_support: true
        },
    ]
}

export type NewListingScreenInput = {
    listing_type: ListingType,
    name: string,
    price: number,
    currency: PriceCurrency,
    desc_full_markdown: string,
    includes_chat_support: boolean,
    includes_video_call_support: boolean,
    video_duration: number,
    show_in_discover: boolean,
    cover_image_url: string,
    tags: { label: string, value: string }[],
    id?: string
}

type Props = {
    initialValues: NewListingScreenInput,
    handleSubmit: (values: NewListingScreenInput) => void
}
// Currently we don't support editing the file names; we only support adding new files and deleting them.

const AddOrEditListingScreen = ({ initialValues, handleSubmit }: Props) => {



    const [activeExampleListing, setActiveExampleListing] = useState(-1)
    const [currentTabId, setCurrentTabId] = useState(0)

    const isEditMode = (initialValues.id)


    return (
        <div>

            <div className="max-w-4xl mx-auto px-4 mt-10 mb-24">

                <Formik initialValues={initialValues}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue }) => (

                        <Form>

                            <div className="mb-3">
                                <CoverImageUpload fieldId="cover_image_url" />
                            </div>


                            <h2 className="font-extrabold text-2xl mb-7">{!isEditMode?'Add a new product or service offering':'Edit listed product or service offering'}</h2>

                            <div className="label font-black mt-5 mb-2 justify-start gap-1 w-full pb-1">Choose one of the listing type:</div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div onClick={() => {
                                    setFieldValue('listing_type', ListingType.Service)
                                    setActiveExampleListing(-1); // reset the tab id

                                }} className={'border border-black cursor-pointer shadow-xl py-4 px-3 ' + (ListingType.Service === values.listing_type ? " bg-secondary text-secondary-content  shadow-2xl": " bg-base-200")}>
                                    <img src='https://img.icons8.com/color/48/000000/service.png' className="w-6 h-6 mr-2" />
                                    <div className="font-bold mt-1 mb-2">Offer Services</div>
                                    <div className="text-sm">Help users with interview preparation, hosting a website, setting up a shopify domain, etc.</div>
                                </div>


                                <div onClick={() => {
                                    setFieldValue('listing_type', ListingType.DigitalProduct)
                                    setActiveExampleListing(-1); // reset the tab id
                                    setFieldValue('includes_video_call_support', false)
                                    setFieldValue('includes_chat_support', false)
                                }} className={'border border-black cursor-pointer shadow-xl py-4 px-3 ' + (ListingType.DigitalProduct === values.listing_type ? " bg-secondary text-secondary-content  shadow-2xl": " bg-base-200")}>
                                    <img src='https://img.icons8.com/color/48/000000/home.png' className="w-6 h-6 mr-2" />
                                    <div className="font-bold mt-1 mb-2">Offer Digital Products</div>
                                    <div className="text-sm">Sell a set of digital files like ebooks, notion template etc that can be downloaded by the user.</div>
                                </div>
                            </div>



                            <div className="label font-bold pb-2 text-gray-600 mt-6">Here are a few examples:</div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-7">

                                {listingTypes[values.listing_type].map((e, indx) => (
                                    <div onClick={() => {
                                        if (indx === activeExampleListing) setActiveExampleListing(-1)
                                        else {
                                            setActiveExampleListing(indx)
                                            setFieldValue('name', e.name)
                                            setFieldValue('includes_video_call_support', e.includes_video_call_support)
                                            setFieldValue('includes_chat_support', e.includes_chat_support)
                                        }
                                    }} key={indx}
                                        className={'border border-black cursor-pointer shadow-xl py-4 px-3 ' + (indx === activeExampleListing ? "bg-accent text-accent-content  shadow-2xl" : "bg-gray-200")}>
                                        {e.logo && <img src={e.logo} className="w-6 h-6 mr-2" />}
                                        <div className="font-semibold text-sm mt-1 mb-2">{e.name}</div>
                                        <div className="text-xs">{e.description}</div>
                                    </div>
                                ))}

                            </div>



                            <label className='input-group my-2 flex-col sm:flex-row'>
                                <div className="label justify-start font-black gap-1 w-full pb-1">Name</div>
                                <Field
                                    name='name'
                                    type='text'
                                    id='name'
                                    autoComplete="off"
                                    placeholder="Name of the product or service"
                                    className="input h-8 input-bordered px-3 text-sm font-medium border-black bg-slate-50 w-full"
                                />
                            </label>



                            <label className='input-group my-2 flex-col sm:flex-row'>
                                <div className="label justify-start font-black w-full pb-1">Price</div>
                                <div className="flex gap-2 w-full">
                                    <Field
                                        name='currency'
                                        type='text'
                                        as='select'
                                        id='currency'
                                        autoComplete="off"
                                        className="input h-8 input-bordered px-3 pl-0 text-sm font-medium border-black bg-slate-50 w-fit">
                                        <option value={PriceCurrency.Inr}>INR</option>
                                        <option value={PriceCurrency.Usd}>USD</option>
                                    </Field>
                                    <Field
                                        name='price'
                                        type='number'
                                        id='price'
                                        min="0"
                                        autoComplete="off"
                                        className="input flex-grow h-8 input-bordered px-3 text-sm font-medium border-black bg-slate-50 w-full"
                                    />
                                </div>
                            </label>


                            {values.listing_type === ListingType.Service ? <>
                                <label className="input-group cursor-pointer py-1 grid grid-cols-2 items-center justify-start gap-3">
                                    <span className="label pb-1 pl-1 text-sm font-black">Includes chat support</span>
                                    <Field type="checkbox" name='includes_chat_support' className="toggle" />
                                </label>


                                <label className="input-group cursor-pointer py-1 grid grid-cols-2 items-center justify-start gap-3">
                                    <span className="label pb-1 pl-1 text-sm font-black">Includes video call support</span>
                                    <Field type="checkbox" name='includes_video_call_support' className="toggle" />
                                </label>

                                <VideoChatLength fieldId="video_duration" videoCallFieldId='includes_video_call_support' />

                            </>
                                :
                                <div className="alert alert-sm bg-gray-200 text-xs font-medium mt-4">Note: In next section you can manage the content files for this digital product</div>
                            }


                            <div>
                                <div className="label font-bold">Description</div>

                                <div className="tabs mb-2 bg-base-100 tabs-boxed">
                                    <a className={"tab gap-2 " + (currentTabId == 0 && "tab-active")} onClick={() => setCurrentTabId(0)}><PencilAltIcon className="w-6" /> <div>Edit</div></a>
                                    <a className={"tab gap-2 " + (currentTabId == 1 && "tab-active")} onClick={() => setCurrentTabId(1)}><EyeIcon className="w-6" /> <div>Preview</div></a>
                                </div>
                                <MDEditorWrapper
                                    height="30vh"
                                    fieldId="desc_full_markdown"
                                    mode={currentTabId === 0 ? "edit" : "preview"} />
                            </div>





                            <div className="font-bold">
                                <FormMultiSelectAsyncField
                                    loadOptions={async (val) => {
                                        if (val.length <= 1)
                                            return [];

                                        const { data } = await apolloClient.query<Query>({
                                            query: getListingTags,
                                            variables: {
                                                query: val
                                            }
                                        });

                                        return data.getListingTags.map(e => ({ value: e, label: e }));
                                    }}
                                    fieldId="tags"
                                    placeholder="Start typing to search..."
                                    fieldLabel="Select tags" options={[]} />
                            </div>

                            <label className="input-group cursor-pointer py-1 grid grid-cols-2 items-center justify-end gap-3">
                                <span className="label pb-1 pl-1 text-sm font-black">Show this post in Discover Section</span>
                                <Field type="checkbox" name='show_in_discover' className="toggle" />
                            </label>



                            <button className="btn mt-7 mb-2" type="submit">{values.listing_type === ListingType.DigitalProduct ? "Next" : "Publish"}</button>
                        </Form>
                    )}
                </Formik>

            </div>
        </div >
    )
}

const VideoChatLength = ({ fieldId, videoCallFieldId }: { fieldId: string, videoCallFieldId: string }) => {
    const { getFieldMeta } = useFormikContext()
    const { value } = getFieldMeta<boolean>(videoCallFieldId)

    const videoDuration = ['30 min', '45 min', '60 min', '90 min', '120 min', 'custom']

    const [videoDurationOptionIndx, setVideoDurationOptionIndx] = useState(0)

    return (
        <div>
            {value && <div className="text-sm text-center flex gap-2 flex-wrap">

                <div className="label justify-start font-black gap-1 w-full pb-1">Call Duration</div>

                {videoDuration.map((e, indx) => (
                    <div onClick={() => setVideoDurationOptionIndx(indx)} key={indx} className={"cursor-pointer px-1 py-2 my-2 w-20 rounded-lg " + (videoDurationOptionIndx == indx ? 'bg-accent' : 'bg-slate-300')}>{e}</div>
                ))}
                {videoDurationOptionIndx + 1 == videoDuration.length && <div className="w-full">

                    <label className='input-group my-2 flex-col sm:flex-row'>
                        <div className="label justify-start font-black gap-1 w-full pb-1 text-gray-500">Custom Duration (in minutes)</div>
                        <Field
                            name={fieldId}
                            type='number'
                            id={fieldId}
                            autoComplete="off"
                            placeholder="360 minutes"
                            className="input h-8 input-bordered px-3 text-sm font-medium border-black bg-slate-50 w-full"
                        />
                    </label>
                </div>}
            </div>}
        </div>
    )

}

export default AddOrEditListingScreen
