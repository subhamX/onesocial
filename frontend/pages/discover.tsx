import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { MainSiteNavbar } from "../components/Navbar.tsx/MainSiteNavbar";
import { EventUI } from "../components/Profile/EventUI";
import { PostUI } from "../components/Profile/PostUI";
import { ProductOrServiceUI } from "../components/Profile/ProductOrServiceUI";
import { SkeletonLoading } from "../components/SkeletonLoading";
import { Post, Query, QueryFetchPostsArgs } from "../graphql/generated_graphql_types";


const tags = ["Software Engineering", "Interview", "System Design Workshop", "Meetup", "Redis"]


const getTrendingTags = gql`
    query getTrendingTags{
        getTrendingEventTags
        getTrendingPostsTags
        getTrendingListingTags
    }
`

const Discover = () => {
    const [currentTab, setCurrentTab] = useState(0);

    const [query, setQuery] = useState("")
    const [tags, setTags] = useState<string[]>([])


    const { data: trendingTags } = useQuery<Query>(getTrendingTags)

    let currentTabTags = (currentTab === 0 ? trendingTags?.getTrendingEventTags : currentTab === 1 ? trendingTags?.getTrendingPostsTags : trendingTags?.getTrendingListingTags)

    const changeTab = (tab: number) => {
        setCurrentTab(tab)
        setTags([])
    }
    return (
        <>

            <MainSiteNavbar />


            <div className="mx-auto max-w-4xl px-4">

            <div className="text-2xl font-black mt-5 mb-10">Discover</div>

                <div className="border px-2 border-black rounded-none w-full gap-2 my-10 flex">
                    <MagnifyingGlassIcon className="w-7" />
                    <input
                        className="w-full py-3 focus:outline-none"
                        placeholder="Search for posts, events, products or services"
                        onChange={(e) => {
                            if (e.target.value.length !== 1) {
                                setQuery(e.target.value)
                            }
                        }}
                    />
                </div>


                <div className="text-sm grid grid-cols-1 sm:grid-cols-10 gap-2 items-center my-5">
                    <div className="font-bold col-span-2">Trending tags:</div>
                    <div className="flex flex-wrap gap-2 col-span-8">
                        {currentTabTags ? currentTabTags.map((currentTag, indx) => {
                            const isActive = tags.findIndex((tag) => tag === currentTag) > -1;
                            return (
                                <div key={indx} className={`border border-black rounded-3xl px-3 py-1 cursor-pointer ${isActive ? 'bg-secondary text-secondary-content' : 'bg-gray-100'}`} onClick={() => {
                                    if (isActive) {
                                        setTags(tags.filter(tag => tag !== currentTag))
                                    } else {
                                        setTags([...tags, currentTag])
                                    }
                                }}>{currentTag}</div>
                            )
                        }) : <div className='border border-black rounded-3xl px-3 py-1 bg-yellow-400'> Loading...</div>}
                    </div>

                </div>

                <div className="flex flex-col mt-4 items-center xs:flex-row justify-center gap-3 tabs tabs-boxed bg-base-100">
                    <a className={`tab w-full xs:w-fit ${currentTab == 0 && 'tab-active'}`} onClick={() => changeTab(0)}>Posts</a>
                    <a className={`tab w-full xs:w-fit ${currentTab == 1 && 'tab-active'}`} onClick={() => changeTab(1)}>Events</a>
                    <a className={`tab w-full xs:w-fit ${currentTab == 2 && 'tab-active'}`} onClick={() => changeTab(2)}>Products &amp; Services</a>
                </div>



                {currentTab == 0 && <DiscoverPostsController query={query} tags={tags} />}
                {currentTab == 1 && <DiscoverEventsController query={query} tags={tags} />}
                {currentTab == 2 && <DiscoverListingsController query={query} tags={tags} />}



            </div>

        </>

    )
}


export default Discover;



export const fetchPosts = gql`

query fetchPosts($payload: QueryEntityInput!){
  fetchPosts(payload: $payload) {
    approx_read_time_in_minutes
    tags
    title
    approx_read_time_in_minutes
    show_in_discover
    published_on
    number_of_comments
    liked_by_count
    desc_mini
    post_id
    creator_id
    cover_image_url
    creator_info{
        avatar_url
        name
        user_id
    }
  }
}
`

const limit = 10

const DiscoverPostsController = ({ query, tags }: { query: string, tags: string[] }) => {
    const [hasMore, setHasMore] = useState(true);

    const [fetchHandler, { data, loading, fetchMore, error }] = useLazyQuery<Query, QueryFetchPostsArgs>(fetchPosts, {
        onCompleted(data) {

            if (data.fetchPosts.length < limit) {
                setHasMore(false)
            }
        },
    })

    useEffect(() => {
        setHasMore(true)
        fetchHandler({
            variables: {
                payload: {
                    limit,
                    offset: 0,
                    query,
                    tags
                },
            }
        })
    }, [fetchHandler, query, tags])

    return (
        <div>
            {(loading || !data) && <DiscoverLoading />}

            <div className="mt-5"></div>
            {error && <div className="alert alert-error">{error.message}</div>}
            {data?.fetchPosts && data.fetchPosts.length !== 0 &&
                <>
                    {data?.fetchPosts.map((post, indx) => (
                        <PostUI key={indx} post={post} />
                    ))}

                    <div className='mb-10'>

                        {hasMore ? <button className="btn btn-primary" onClick={() => {
                            fetchMore({
                                variables: {
                                    payload: {
                                        limit,
                                        offset: data?.fetchPosts.length,
                                        query,
                                        tags
                                    }
                                },
                            }).then(e => {
                                if (e.data.fetchPosts.length < limit) setHasMore(false);
                            })
                        }}>Load more...</button> : <div className='alert font-black text-gray-500 flex text-sm justify-center'>That&apos;s the end.. 🎉</div>}
                    </div>
                </>

            }

            {data?.fetchPosts.length === 0 && <div className="alert max-w-3xl my-2 mx-auto alert-info">No listings for the specified query!</div>}
        </div>
    )
}

const fetchEvents = gql`
query fetchEvents($payload: QueryEntityInput!){
  fetchEvents(payload: $payload) {
    cover_image_url
    desc_full_markdown
    title
    tags
    cover_image_url
    event_id
    organizer_id
    tags
    event_start_time
    duration_in_minutes
    number_of_registrations
  }
}
`


const DiscoverEventsController = ({ query, tags }: { query: string, tags: string[] }) => {
    const [hasMore, setHasMore] = useState(true);

    const [fetchHandler, { data, loading, fetchMore, error }] = useLazyQuery<Query, QueryFetchPostsArgs>(fetchEvents, {
        onCompleted(data) {

            if (data.fetchEvents.length < limit) {
                setHasMore(false)
            }
        },
    })

    useEffect(() => {
        setHasMore(true)
        fetchHandler({
            variables: {
                payload: {
                    limit,
                    offset: 0,
                    query,
                    tags
                },
            }
        })
    }, [fetchHandler, query, tags])

    return (
        <div>
            {loading && <DiscoverLoading />}

            <div className="mt-5"></div>
            {error && <div className="alert alert-error">{error.message}</div>}
            {data?.fetchEvents && data.fetchEvents.length !== 0 &&
                <>
                    {data?.fetchEvents.map((event, indx) => (
                        <EventUI key={indx} event={event} />
                    ))}

                    <div className='mb-10'>

                        {hasMore ? <button className="btn btn-primary" onClick={() => {
                            fetchMore({
                                variables: {
                                    payload: {
                                        limit,
                                        offset: data?.fetchEvents.length,
                                        query,
                                        tags
                                    }
                                },
                            }).then(e => {
                                if (e.data.fetchEvents.length < limit) setHasMore(false);
                            })
                        }}>Load more...</button> : <div className='alert font-black text-gray-500 flex text-sm justify-center'>That&apos;s the end.. 🎉</div>}
                    </div>
                </>

            }

            {data?.fetchEvents.length === 0 && <div className="alert max-w-3xl my-2 mx-auto alert-info">Sorry! There are no upcoming events for the specified query! 😭</div>}
        </div>
    )
}


const fetchListings = gql`
query fetchListings($payload: QueryEntityInput!){
  fetchListings(payload: $payload) {
    author_id
    name
    listing_type
    author {
      avatar_url
      name
      tagline
      user_id
    }
    currency
    price
    reviews_score
    number_of_reviews
    cover_image_url
  }
}
`


const DiscoverListingsController = ({ query, tags }: { query: string, tags: string[] }) => {
    const [hasMore, setHasMore] = useState(true);

    const [fetchHandler, { data, loading, fetchMore, error }] = useLazyQuery<Query, QueryFetchPostsArgs>(fetchListings, {
        onCompleted(data) {

            if (data.fetchListings.length < limit) {
                setHasMore(false)
            }
        },
    })

    useEffect(() => {
        setHasMore(true)
        fetchHandler({
            variables: {
                payload: {
                    limit,
                    offset: 0,
                    query,
                    tags
                },
            }
        })
    }, [fetchHandler, query, tags])

    return (
        <div>
            {loading && <DiscoverLoading />}

            <div className="mt-5"></div>
            {error && <div className="alert alert-error">{error.message}</div>}
            {data?.fetchListings && data.fetchListings.length !== 0 &&
                <>
                    {data?.fetchListings.map((listing, indx) => (
                        <ProductOrServiceUI key={indx} listingInstance={listing} />
                    ))}

                    <div className='mb-10'>

                        {hasMore ? <button className="btn btn-primary" onClick={() => {
                            fetchMore({
                                variables: {
                                    payload: {
                                        limit,
                                        offset: data?.fetchListings.length,
                                        query,
                                        tags
                                    }
                                },
                            }).then(e => {
                                if (e.data.fetchListings.length < limit) setHasMore(false);
                            })
                        }}>Load more...</button> : <div className='alert font-black text-gray-500 flex text-sm justify-center'>That&apos;s the end.. 🎉</div>}
                    </div>
                </>

            }

            {data?.fetchListings.length === 0 && <div className="alert max-w-3xl my-2 mx-auto alert-info">No events for the specified query!</div>}
        </div>
    )
}



const DiscoverLoading = () => (
    <div className="my-11">
        <SkeletonLoading />
        <div className="my-8"></div>
        <SkeletonLoading />
    </div>
)
