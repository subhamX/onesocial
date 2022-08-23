import { useQuery } from "@apollo/client"
import { Menu } from "@headlessui/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode } from "react"
import { toast } from "react-toastify"
import { BLOG_URL, DASHBOARD_URL, FEATURES_URL_HASH, LOGOUT_URL, NEW_USER_WELCOME_URL } from "../../config/ScreenRoutes"
import { apolloClient } from "../../graphql"
import { Query } from "../../graphql/generated_graphql_types"
import { GET_CURRENT_USER } from "../../graphql/queries/getCurrentUser"




export const MainSiteNavbar = ({ leadingBlock }: { leadingBlock?: ReactNode }) => {
    const { loading, error, data } = useQuery<Query>(GET_CURRENT_USER)

    const is_logged_in = (!loading && !error && data?.getCurrentUser !== null);

    const router = useRouter()
    const currentRoute = router.pathname

    const logOutUser = async () => {
        try {
            const res = await fetch(LOGOUT_URL)
            const json = await res.json()
            if (json.error) throw new Error(json.message)
            toast(json.message, {
                type: "success"
            })
            apolloClient.refetchQueries({
                include: "active"
            })
        } catch (err) {
            toast((err as any).message, {
                type: "error"
            })
        }
    }

    return (
        <div className="min-h-16 px-4 flex border-b-black border-b">
            <nav className="mx-auto w-full max-w-6xl flex items-center justify-between gap-7">
                {leadingBlock ? leadingBlock : <div className="font-bold text-2xl text-left flex-grow">OneSocial</div>}
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
                            <>
                                <Link href={DASHBOARD_URL}>
                                    {/* Only for Authenticated User */}
                                    <div className="btn btn-sm btn-primary">Dashboard</div>
                                </Link>

                                {/* Only for Authenticated User */}
                                <div onClick={logOutUser} className="btn btn-sm btn-primary btn-outline">Log Out</div>
                            </>
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
                            <MyDropdown logOutUser={logOutUser} is_logged_in={is_logged_in} />
                        </>
                    )}

                </Menu>

            </nav>
        </div>

    )
}


function MyDropdown({ is_logged_in, logOutUser }: { is_logged_in: boolean, logOutUser: () => void }) {


    return (
        <>
            <Menu.Items className='sm:hidden bg-base-100 absolute top-16 left-0 bottom-0 right-0 z-50'>
                <Link
                    href={FEATURES_URL_HASH}
                >
                    <Menu.Item as='div' className='cursor-pointer w-full px-5 py-4 border-b border-b-black'>

                        <div className="">
                            Features
                        </div>
                    </Menu.Item>
                </Link>

                <Link
                    href={BLOG_URL}
                >
                    <Menu.Item as='div' className='cursor-pointer w-full px-5 py-4 border-b border-b-black'>

                        <div className="">
                            Blog
                        </div>
                    </Menu.Item>
                </Link>


                {is_logged_in ?
                    <>
                        <Link
                            href={DASHBOARD_URL}
                        >
                            <Menu.Item as='div' className='cursor-pointer w-full px-5 py-4 border-b border-b-black'>
                                {/* Only for Authenticated User */}


                                <div className="">
                                    Dashboard
                                </div>
                            </Menu.Item>
                        </Link>

                        <Menu.Item as='div' className='cursor-pointer w-full px-5 py-4 border-b border-b-black'>
                            {/* Only for Authenticated User */}


                            <div className="" onClick={logOutUser}>
                                Log Out
                            </div>
                        </Menu.Item>
                    </>
                    :
                    <Link
                        href={NEW_USER_WELCOME_URL}
                    >
                        <Menu.Item as='div' className='cursor-pointer w-full px-5 py-4 border-b border-b-black'>
                            {/* Only for Non Authenticated User */}

                            <div className="">
                                Login
                            </div>
                        </Menu.Item>
                    </Link>
                }
            </Menu.Items>
        </>

    )
}
