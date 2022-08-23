import { EyeIcon, PencilAltIcon } from "@heroicons/react/solid";
import { Field, Form, Formik, useFormikContext } from "formik";
import { useState } from "react";
import { FormMultiSelectAsyncField } from "./Forms/FormMultiSelectAsyncField";
import { MainSiteNavbar } from "./Navbar.tsx/MainSiteNavbar";
import { UploadSingleImageWidget } from "./UploadSingleImageWidget";
import { MDEditorWrapper } from "./MDEditorWrapper";
import { CoverImageUpload } from "./CoverImageUpload";
import { apolloClient } from "../graphql";
import { getPostTags } from "../graphql/queries/getPostTags";
import { Query } from "../graphql/generated_graphql_types";
import { FormInputField } from "./Forms/FormInputField";
import { DesktopComputerIcon, GlobeIcon, GlobeAltIcon, LinkIcon, ShieldCheckIcon, LockClosedIcon, CalendarIcon, ClockIcon } from "@heroicons/react/outline";
import { getEventTags } from "../graphql/queries/getEventTags";

export const CreateOrEditEventForm = ({ handleSubmit, initialValues }: { handleSubmit: any; initialValues: any; }) => {
    const [currentTabId, setCurrentTabId] = useState(0);

    return (
        <div>

            <div className="mt-5 mb-10 mx-auto max-w-4xl px-4">
                <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>

                    <Form>

                        <div className="mb-3">
                            <CoverImageUpload fieldId="cover_image_url" />
                        </div>



                        <label>
                            <div className="label font-bold">Event Name</div>
                            <Field
                                name="title"
                                type="text"
                                id="title"
                                autoComplete="off"
                                placeholder="GraphQL Introductory Session"
                                className="px-2 border py-3 mb-3 -mt-1 text-xl font-black min-h-full w-full" />
                        </label>


                        <label>
                            <div className="label font-bold">Where shall we have the event?</div>
                            <LocationType fieldId="location_type" />
                        </label>

                        <LocationTypeDetails fieldId="location_type" />



                        <label className='input-group text-sm font-medium my-2 flex-col sm:flex-row'>
                            <div className="label justify-start gap-1 w-full pb-1"><CalendarIcon className="w-6" /> Start Time</div>
                            <Field
                                name='event_start_time'
                                type='datetime-local'
                                id='address'
                                autoComplete="off"
                                // placeholder='221B Baker Street, Marylebone, London NW1 6XE, UK'
                                className="input h-8 input-bordered px-3 border-black bg-slate-50 w-full"
                            />
                        </label>

                        <label className='input-group text-sm font-medium  my-2 flex-col sm:flex-row'>
                            <div className="label justify-start gap-1 w-full pb-1"><ClockIcon className="w-6" />End Time</div>
                            <Field
                                name='event_end_time'
                                type='datetime-local'
                                id='address'
                                autoComplete="off"
                                // placeholder='221B Baker Street, Marylebone, London NW1 6XE, UK'
                                className="input h-8 input-bordered px-3 border-black bg-slate-50 w-full"
                            />
                        </label>

                        {/* Event Desciption */}
                        <div className="flex justify-between mt-4">
                            <div className="tabs mb-4 bg-base-100 tabs-boxed">
                                <a className={"tab gap-2 " + (currentTabId == 0 && "tab-active")} onClick={() => setCurrentTabId(0)}><PencilAltIcon className="w-6" /> <div>Edit</div></a>
                                <a className={"tab gap-2 " + (currentTabId == 1 && "tab-active")} onClick={() => setCurrentTabId(1)}><EyeIcon className="w-6" /> <div>Preview</div></a>
                            </div>

                            <UploadSingleImageWidget />
                        </div>


                        <label>
                            <div className="label font-bold">Event Description</div>

                            <MDEditorWrapper
                                fieldId="desc_full_markdown"
                                mode={currentTabId === 0 ? "edit" : "preview"} />
                        </label>

                        <div className="font-bold">
                            <FormMultiSelectAsyncField
                                loadOptions={async (val) => {
                                    if (val.length <= 1)
                                        return [];

                                    const { data } = await apolloClient.query<Query>({
                                        query: getEventTags,
                                        variables: {
                                            query: val
                                        }
                                    });
                                    return data.getEventTags.map(e => ({ value: e, label: e }));
                                }}
                                fieldId="tags"
                                placeholder="Start typing to search..."
                                fieldLabel="Select tags" options={[]} />
                        </div>

                        <label className="label cursor-pointer flex justify-end gap-3">
                            <span className="label-text font-bold">Show this post in Discover Section</span>
                            <Field type="checkbox" name='show_in_discover' className="toggle" />
                        </label>

                        <label className="label cursor-pointer flex justify-end gap-3">
                            <span className="label-text font-bold">Allow only followers</span>
                            <Field type="checkbox" name='is_member_only_event' className="toggle" />
                        </label>


                        <button className="btn btn-warning" type="submit">Publish</button>

                    </Form>
                </Formik>
            </div>
        </div>
    );
};


const LocationType = ({ fieldId }: { fieldId: string }) => {
    const { getFieldMeta, getFieldHelpers } = useFormikContext();
    const { value } = getFieldMeta(fieldId)
    const { setValue } = getFieldHelpers(fieldId)

    return (
        <div className="tabs mb-4 bg-base-100 tabs-boxed">
            <a className={"tab gap-2 " + (value == 'VIRTUAL' && "tab-active")} onClick={() => setValue('VIRTUAL')}><DesktopComputerIcon className="w-6" /> <div>Online</div></a>
            <a className={"tab gap-2 " + (value == 'IN_PERSON' && "tab-active")} onClick={() => setValue('IN_PERSON')}><GlobeAltIcon className="w-6" /> <div>In Person</div></a>
        </div>
    )

}


const LocationTypeDetails = ({ fieldId }: { fieldId: string }) => {
    const { getFieldMeta, getFieldHelpers } = useFormikContext();
    const { value } = getFieldMeta(fieldId)


    return (
        <div className="font-medium text-sm bg-base-200 pb-4 pt-2 px-5 border">

            <label className='input-group my-2 flex-col sm:flex-row'>
                <div className="label w-full justify-start gap-1 pb-1"><LinkIcon className="w-6" /> Event Url {value === 'IN_PERSON' && '(optional)'}</div>
                <Field
                    name='event_url'
                    type='url'
                    id='event_url'
                    autoComplete="off"
                    placeholder='https://meet.google.com/abc-xyz'
                    className="input h-8 input-bordered px-3 border-black bg-slate-50 w-full"
                />
            </label>

            <label className='input-group my-2 flex-col sm:flex-row'>
                <div className="label justify-start gap-1 w-full pb-1"><GlobeIcon className="w-6" /> Address  {value === 'VIRTUAL' && '(optional)'}</div>
                <Field
                    name='address'
                    type='text'
                    id='address'
                    autoComplete="off"
                    placeholder='221B Baker Street, Marylebone, London NW1 6XE, UK'
                    className="input h-8 input-bordered px-3 border-black bg-slate-50 w-full"
                />
            </label>


            <label className='input-group my-2 flex-col sm:flex-row items-start'>
                <div className="label justify-start gap-1 w-full pb-1"><ShieldCheckIcon className="w-6" /> Additional (Secret Info 🤐)</div>
                <Field
                    name='additional_info'
                    type='textarea'
                    as='textarea'
                    id='additional_info'
                    placeholder='(optional) The meeting password is "12345"'
                    autoComplete="off"
                    className="input input-bordered px-3 h-32 border-black bg-slate-50 w-full"
                />
            </label>

            <div className="alert alert-sm font-semibold text-xs flex-col items-start gap-1">
                <p className="text-gray-400">
                    <LockClosedIcon className="w-7" />Important: The following data will be visible to users only after they register. So keep the private things like meeting passwords etc in here.
                </p>
            </div>


        </div>
    )
}
