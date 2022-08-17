import { Menu } from "@headlessui/react"
import Link from "next/link"
import { ReactNode } from "react"
import { BLOG_URL, DASHBOARD_URL, FEATURES_URL_HASH, NEW_USER_WELCOME_URL } from "../../config/ScreenRoutes"


export const MainSiteNavbar = ({ leadingBlock }: { leadingBlock?: ReactNode }) => {
    const is_logged_in = true;

    return (
        <div className="min-h-16 px-4 flex border-b-black border-b">
            <nav className="mx-auto w-full max-w-6xl flex items-center justify-between gap-7">
                {leadingBlock ? leadingBlock : <div className="font-bold text-2xl text-left flex-grow">WingMate</div>}
                <div className="hidden sm:flex justify-between flex-grow items-center">
                    <div className="flex justify-between gap-5">
                        <Link href={FEATURES_URL_HASH}>
                            <div className="cursor-pointer hover:underline decoration-dashed">Features</div>
                        </Link>
                        <Link href={BLOG_URL}>
                            <div className="cursor-pointer hover:underline decoration-dashed">Blog</div>
                        </Link>

                    </div>
                    <div className="flex gap-3 items-center">

                        {is_logged_in ?
                            <Link href={DASHBOARD_URL}>
                                {/* Only for Authenticated User */}
                                <div className="btn btn-sm btn-primary">Dashboard</div>
                            </Link>
                            :
                            <Link href={NEW_USER_WELCOME_URL}>
                                {/* Only for Non Authenticated User */}
                                <div className="btn btn-sm btn-primary">Login</div>
                            </Link>}
                    </div>
                </div>

                <Menu>
                    {({ open }) => (
                        <>
                            <Menu.Button className='block text-sm xss:text-base sm:hidden'>{open ? 'Close' : 'Menu'}</Menu.Button>
                            <MyDropdown is_logged_in={is_logged_in} />
                        </>
                    )}

                </Menu>

            </nav>
        </div>

    )
}


function MyDropdown({ is_logged_in }: { is_logged_in: boolean }) {
    return (
        <>
            <Menu.Items className='sm:hidden bg-base-100 absolute top-16 left-0 bottom-0 right-0 z-50'>
                <Menu.Item as='div' className='cursor-pointer w-full px-5 py-4 border-b border-b-black'>
                    <Link
                        href={FEATURES_URL_HASH}
                    >
                        <div className="">
                            Features
                        </div>
                    </Link>
                </Menu.Item>
                <Menu.Item as='div' className='cursor-pointer w-full px-5 py-4 border-b border-b-black'>
                    <Link
                        href={BLOG_URL}
                    >
                        <div className="">
                            Blog
                        </div>
                    </Link>
                </Menu.Item>

                {is_logged_in ?
                    <Menu.Item as='div' className='cursor-pointer w-full px-5 py-4 border-b border-b-black'>
                        {/* Only for Authenticated User */}

                        <Link
                            href={DASHBOARD_URL}
                        >
                            <div className="">
                                Dashboard
                            </div>
                        </Link>
                    </Menu.Item>
                    :
                    <Menu.Item as='div' className='cursor-pointer w-full px-5 py-4 border-b border-b-black'>
                        {/* Only for Non Authenticated User */}
                        <Link
                            href={NEW_USER_WELCOME_URL}
                        >
                            <div className="">
                                Login
                            </div>
                        </Link>
                    </Menu.Item>
                }
            </Menu.Items>
        </>

    )
}
