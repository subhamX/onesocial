import { toast } from "react-toastify";
import { Popover, Transition } from '@headlessui/react'
import { PhotographIcon } from "@heroicons/react/solid";
import { CloudUploadIcon as CloudUploadIconOutline } from "@heroicons/react/outline";

import { useState } from "react";
import { handleSingleImageUpload } from "../utils/handleSingleImageUpload";

// UI Credits: https://flowbite.com/docs/forms/file-input/

export const UploadSingleImageWidget = () => {
    const [secureUrl, setSecureUrl] = useState("")
    const [uploading, setUploading] = useState(false)


    const handleFileUpload = async (event: any) => {
        try {
            const file = event.target?.files?.[0];
            if (file) {
                setUploading(true)
                const url = await handleSingleImageUpload('image', file)
                setSecureUrl(url)
                setUploading(false);
            }
        } catch (err: any) {
            toast(err.message, { type: 'error' });
            setUploading(false)
        }
    }
    return (
        <>
            <Popover className='relative text-sm' >
                {({ open }) => (
                    <>
                        <Popover.Button>
                            <div className="gap-1 tab">
                                <PhotographIcon className="w-4" /><div>Upload Img</div>
                            </div>
                        </Popover.Button>

                        <Transition
                            show={open}
                            // enter="transition duration-100 ease-out"
                            // enterFrom="transform scale-95 opacity-0"
                            // enterTo="transform scale-100 opacity-100"
                            // leave="transition duration-75 ease-out"
                            // leaveFrom="transform scale-100 opacity-100"
                            // leaveTo="transform scale-95 opacity-0"
                        >

                            <Popover.Panel static>
                                <div className="w-72 max-w-screen z-50 border-b border-x border-gray-300 absolute shadow-lg bg-gray-200  text-gray-800 py-6 px-4 top-10 -right-3 rounded-md">
                                    {secureUrl === "" ? <>
                                        {uploading ?
                                            <div className="flex justify-center gap-1 text-sm"><CloudUploadIconOutline className='w-6' /><div> Uploading.. Please wait.</div></div> :


                                            <>
                                                <div className="flex justify-center items-center w-full">
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
                                                                Please select a file to upload, and we shall share the public link 🤫.
                                                            </p>
                                                        </div>
                                                        <input id="dropzone-file" accept="image/png, image/gif, image/jpeg, image/jpg" onChange={handleFileUpload} type="file" className="hidden" />
                                                    </label>
                                                </div>
                                            </>
                                        }
                                    </> :
                                        <>
                                            <input onClick={() => {
                                                try {
                                                    navigator.clipboard.writeText(secureUrl)
                                                    toast('Image Link successfully copied to clipboard.', { type: 'success' })
                                                } catch (err: any) {
                                                    toast(err.message, { type: 'error' })
                                                }
                                            }} type='text' className='cursor caret-transparent text-xs w-full py-2 px-4' contentEditable={false} defaultValue={secureUrl} />
                                            <div className="mt-3 text-xs">* Tap above to copy link to clipboard</div>

                                            <div className="btn btn-xs mt-3" onClick={() => {
                                                setSecureUrl("")
                                                setUploading(false)
                                            }}>New upload</div>
                                        </>}


                                </div>
                                <div className="text-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute w-10 top-6 right-4" viewBox="0 0 88 75" fill="none">
                                        <path d="M44 0L87.3013 75H0.69873L44 0Z" fill="currentColor" />
                                    </svg>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>)}

            </Popover>

        </>
    );
};
