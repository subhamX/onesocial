import dayjs from 'dayjs'
import Link from 'next/link'
import { DETAILED_EVENT } from '../../config/ScreenRoutes'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { gql, useQuery } from '@apollo/client'
import { Query, QueryGetEventsInWallArgs } from '../../graphql/generated_graphql_types'
import { useState } from 'react'
import { Loading } from '../Commons/Loading'

dayjs.extend(duration)
dayjs.extend(relativeTime)


const getEventsInWall = gql`

query($offset: Int!, $limit: Int!, $wall_id: String!){
  getEventsInWall(offset: $offset, limit: $limit, wall_id: $wall_id) {
    cover_image_url
    duration_in_minutes
    event_id
    event_start_time
    number_of_registrations
    show_in_discover
    tags
    title
    organizer_id
    is_member_only_event
  }
}

`

export const EventsComponent = ({ userId }: { userId: string }) => {
    const [hasMore, setHasMore] = useState(true)


    const { data, fetchMore, loading: isEventsLoading } = useQuery<Query, QueryGetEventsInWallArgs>(getEventsInWall, {
        variables: {
            offset: 0,
            limit: 10,
            wall_id: userId
        },
        skip: (!userId),
        fetchPolicy: 'cache-and-network',
        onCompleted(data) {
            if (data.getEventsInWall.length < 10) setHasMore(false)
        }
    })

    const events = data?.getEventsInWall ?? []

    return (
        <div className='max-w-4xl  mx-auto px-4'>
            {isEventsLoading && !data?.getEventsInWall && <Loading text='Crunching latest events... ⟨䷄⟩'/>}
            {data?.getEventsInWall?.length === 0 && <div className="alert max-w-3xl my-2 mx-auto alert-info">No events yet!</div>}

            {data?.getEventsInWall && !!events.length &&
                <div className='my-3'>

                    {events.map((e, indx) => {
                        const date = dayjs(e.event_start_time)

                        return (
                            <Link key={indx} href={DETAILED_EVENT(e.event_id)}>
                                <div className='cursor-pointer flex flex-col sm:grid sm:grid-cols-5 border py-6 my-3 px-4 hover:bg-slate-50 items-center gap-4'>
                                    <div className='col-span-2 flex gap-2 w-full items-center flex-row-reverse sm:flex-row'>
                                        <Calender className='hidden xs:flex w-full flex-grow' date={date.format('DD')} month={date.format('MMM')} />
                                        <img src={e.cover_image_url} className='w-full h-28 object-cover sm:max-w-64 rounded-lg border border-blue-200' />
                                    </div>


                                    <div className='mt-4 sm:mt-0 break-words w-full col-span-3 col-start-3'>
                                        <div className="font-extrabold text-xl">
                                            {e.title}
                                        </div>

                                        <div className='text-sm mb-2'>
                                            {date.format('dddd, MMMM D, YYYY h:mm A')}
                                        </div>

                                        <div className='text-gray-500 font-medium text-sm'>
                                            {!e.is_member_only_event ? "Public Event" : "Members Only Event"}
                                        </div>

                                        <div className='text-gray-500 font-medium text-sm'>
                                            Duration: {dayjs.duration({ minutes: e.duration_in_minutes }).humanize()} (approx)
                                        </div>

                                        <div className='text-blue-500 font-medium text-sm'>
                                            {e.number_of_registrations}+ Registrations
                                        </div>


                                    </div>

                                </div>
                            </Link>
                        )
                    })}


                    <div className='mb-10'>

                        {hasMore ? <button className="btn btn-primary" onClick={() => fetchMore({
                            variables: {
                                offset: (events.length),
                                limit: 10,
                                wall_id: userId
                            },

                        }).then(e => {
                            if (e.data.getEventsInWall.length < 10) setHasMore(false);
                        })}>Load more...</button> : <div className='alert font-black text-gray-500 flex text-sm justify-center'>That&apos;s the end.. 🎉</div>}
                    </div>

                </div>
            }

        </div>
    )
}


export const Calender = ({ date, month, className }: { date: string, month: string, className: string }) => (
    <div className={'w-20 h-fit flex flex-col border rounded-lg overflow-hidden text-center ' + className}>
        <div className='bg-gray-800 flex justify-center items-center font-medium h-8 text-white'>
            {month}
        </div>
        <div className='bg-gray-50 h-8 flex justify-center items-center'>
            {date}
        </div>
    </div>
)
