import {
  PhotoIcon as PhotographIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useFormikContext } from "formik";
import { useState } from "react";
import { handleSingleImageUpload } from "../utils/handleSingleImageUpload";
import { toast } from "react-toastify";

export const CoverImageUpload = ({ fieldId }: { fieldId: string }) => {
  const [isUploading, setIsUploading] = useState(false);
  const { setFieldValue, getFieldMeta } = useFormikContext();

  const [currentUrl, setCurrentUrl] = useState(
    getFieldMeta<string>(fieldId)?.initialValue ?? ""
  );

  const handleImageUpload = async (evt: any) => {
    try {
      const file = evt?.target?.files?.[0];
      if (file) {
        setIsUploading(true);
        const url = await handleSingleImageUpload("image", file);
        setCurrentUrl(url);
        setIsUploading(false);

        setFieldValue(fieldId, url);
      }
    } catch (err: any) {
      console.log(err);
      setIsUploading(false);
      toast(err.message, { type: "error" });
    }
  };
  return (
    <>
      {currentUrl !== "" ? (
        <div
          className="relative group z-50 border-gray-300 border overflow-hidden"
          onClick={() => setCurrentUrl("")}
        >
          <div className="absolute top-0 bg-black opacity-50 group-hover:flex text-lg hidden h-[30vh] w-full justify-end cursor-pointer items-center sm:items-start">
            <div className="text-white">
              <button className="uppercase text-sm px-5 py-4 font-black flex gap-2 items-center">
                <TrashIcon className="w-6" />{" "}
                <div>Click to remove this cover img</div>
              </button>
            </div>
          </div>
          <img className="h-[30vh] w-full object-cover" src={currentUrl} />
        </div>
      ) : (
        <label className="gap-1 tab bg-gray-100 border items-center py-1 h-fit rounded-xl">
          <div className="gap-1 tab button">
            <PhotographIcon className="w-5" />
            <div>
              {isUploading ? "Uploading. Please wait..." : "Upload Cover Photo"}
            </div>
          </div>
          <input
            type="file"
            accept="image/png, image/gif, image/jpeg, image/jpg"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      )}
    </>
  );
};
