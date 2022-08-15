import { Menu } from "@headlessui/react"
import Link from "next/link"
import { BLOG_URL, DASHBOARD_URL, FEATURES_URL_HASH, NEW_USER_WELCOME_URL } from "../../config/ScreenRoutes"


export const Navbar = () => {
    return (
        <div className="mb-7 h-12 overflow-hidden mt-2 px-4 mx-auto border-b-black border-b">
            <nav className="flex items-center justify-between">
                <div className="font-bold text-2xl text-left flex-grow">WingMate</div>
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
                        {/* Only for Non Authenticated User */}
                        <Link href={NEW_USER_WELCOME_URL}>
                            <div className="btn btn-sm btn-primary">Login</div>
                        </Link>

                        {/* Only for Authenticated User */}
                        <Link href={DASHBOARD_URL}>
                            <div className="btn btn-sm btn-primary">Dashboard</div>
                        </Link>

                    </div>
                </div>

                <Menu>
                    {({ open }) => (
                        <>
                            <Menu.Button className='block sm:hidden'>{open ? 'Close' : 'Menu'}</Menu.Button>
                            <MyDropdown />
                        </>
                    )}

                </Menu>

            </nav>
        </div>
    )
}


function MyDropdown() {
    return (
        <>
            <Menu.Items className='absolute top-14 left-0 bottom-0 right-0 '>
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

                {/* Only for Non Authenticated User */}
                <Menu.Item as='div' className='cursor-pointer w-full px-5 py-4 border-b border-b-black'>
                    <Link
                        href={NEW_USER_WELCOME_URL}
                    >
                        <div className="">
                            Login
                        </div>
                    </Link>
                </Menu.Item>

                {/* Only for Authenticated User */}
                <Menu.Item as='div' className='cursor-pointer w-full px-5 py-4 border-b border-b-black'>
                    <Link
                        href={DASHBOARD_URL}
                    >
                        <div className="">
                            Dashboard
                        </div>
                    </Link>
                </Menu.Item>

            </Menu.Items>
        </>

    )
}
