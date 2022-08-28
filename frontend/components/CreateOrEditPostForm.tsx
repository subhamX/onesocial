import {
  EyeIcon,
  PencilSquareIcon as PencilAltIcon,
} from "@heroicons/react/24/solid";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { FormMultiSelectAsyncField } from "./Forms/FormMultiSelectAsyncField";
import { MainSiteNavbar } from "./Navbar.tsx/MainSiteNavbar";
import { UploadSingleImageWidget } from "./UploadSingleImageWidget";
import { MDEditorWrapper } from "./MDEditorWrapper";
import { CoverImageUpload } from "./CoverImageUpload";
import { apolloClient } from "../graphql";
import { getPostTags } from "../graphql/queries/getPostTags";
import { Query } from "../graphql/generated_graphql_types";

export const CreateOrEditPostForm = ({
  handleSubmit,
  initialValues,
}: {
  handleSubmit: any;
  initialValues: any;
}) => {
  const [currentTabId, setCurrentTabId] = useState(0);

  return (
    <div>
      <div className="mt-5 mb-10 mx-auto max-w-4xl px-4">
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="mb-3">
              <CoverImageUpload fieldId="cover_image_url" />
            </div>

            <Field
              name="title"
              type="text"
              id="title"
              autoComplete="off"
              placeholder="Article title..."
              className="border px-3 py-4 mb-7 text-3xl font-black min-h-full w-full"
            />

            <div className="flex justify-between">
              <div className="tabs mb-4 bg-base-100 tabs-boxed">
                <a
                  className={"tab gap-2 " + (currentTabId == 0 && "tab-active")}
                  onClick={() => setCurrentTabId(0)}
                >
                  <PencilAltIcon className="w-6" /> <div>Edit</div>
                </a>
                <a
                  className={"tab gap-2 " + (currentTabId == 1 && "tab-active")}
                  onClick={() => setCurrentTabId(1)}
                >
                  <EyeIcon className="w-6" /> <div>Preview</div>
                </a>
              </div>

              <UploadSingleImageWidget />
            </div>
            <MDEditorWrapper
              fieldId="desc_full_markdown"
              mode={currentTabId === 0 ? "edit" : "preview"}
            />

            <div className="font-bold">
              <FormMultiSelectAsyncField
                loadOptions={async (val) => {
                  if (val.length <= 1) return [];

                  const { data } = await apolloClient.query<Query>({
                    query: getPostTags,
                    variables: {
                      query: val,
                    },
                  });
                  return data.getPostTags.map((e) => ({ value: e, label: e }));
                }}
                fieldId="tags"
                placeholder="Start typing to search..."
                fieldLabel="Select tags"
                options={[]}
              />
            </div>

            <label className="label cursor-pointer flex justify-end gap-3">
              <span className="label-text font-bold">
                Show this post in Discover Section
              </span>
              <Field
                type="checkbox"
                name="show_in_discover"
                className="toggle"
              />
            </label>
            <button className="btn btn-warning">Publish</button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};
