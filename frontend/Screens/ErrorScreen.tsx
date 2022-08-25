import Link from "next/link";
import { MainSiteNavbar } from "../components/Navbar.tsx/MainSiteNavbar";
import { ServerErrorIllustration } from "../icons/ServerErrorIllustration";



export const ErrorScreen = ({ heading = "Server Error", message }: { heading?: string, message?: string }) => (
    <>

        <MainSiteNavbar />

        <div className="max-w-2xl py-10 mx-auto px-4">
            <div className="font-black text-3xl mb-10">
                <h1>{heading}</h1>
            </div>
            <ServerErrorIllustration />
            <div className="flex flex-col mt-10 mb-2 bg-red-100 px-6 py-4 text-sm border-2 rounded-b shadow-sm border-red-500">
                <div className="flex gap-1 items-center">
                    <div className="ml-3">
                        <div className="w-full text-gray-900 mt-0">
                            Something went terribly wrong. Please allow us some time to fix
                            it.
                        </div>
                    </div>
                </div>

                {message && <div className="text-xs mt-3 ml-1">Details: {message}</div>}
            </div>
            <div className="flex justify-center gap-3">
                <Link href="/">
                    <button className="btn btn-primary">Home</button>
                </Link>
                <a href="mailto:idevsubham@gmail.com">
                    <button className="btn btn-primary">Report this issue</button>
                </a>
            </div>
        </div>

    </>
)
