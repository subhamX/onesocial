import dayjs from 'dayjs'
import Link from 'next/link'
import { DETAILED_EVENT } from '../../config/ScreenRoutes'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(duration)
dayjs.extend(relativeTime)


type Props = {
    events: {
        title: string,
        event_start_time: string,
        duration_in_minutes: number, 
        cover_image_url: string,
        is_members_only: boolean, // if false, then anyone can join
        location_type: 'virtual' | 'in_person',

        event_url?: string, // incase of virtual
        address?: string, // incase of in_person

        number_of_registrations: number,
        // number_of_approved_guests: number, // TODO: There is no concept of approval right now!!!!!! only for admin

        owner_id: string,
        event_id: string,

    }[]
}

export const EventsComponent = ({ events }: Props) => {
    return (
        <div>



            <div className="alert max-w-xl my-2 mx-auto alert-info">Crunching latest events... ⟨䷄⟩</div>
            {events.length === 0 && <div className="alert max-w-3xl my-2 mx-auto alert-info">No events yet!</div>}


            <div className='max-w-4xl  mx-auto px-4 my-3'>

                {events.map((e, indx) => {
                    const date = dayjs(e.event_start_time)

                    return (
                        <Link key={indx} href={DETAILED_EVENT(e.event_id)}>
                            <div className='cursor-pointer sm:flex border py-6 my-3 px-4 hover:bg-slate-50 items-center gap-4'>
                               <div className='flex gap-2 items-center flex-row-reverse sm:flex-row'>
                               <Calender className='hidden xs:flex' date={date.format('DD')} month={date.format('MMM')} />

                                <img src={e.cover_image_url} className='flex-grow w-full h-28 object-cover sm:w-64 rounded-lg border border-blue-200' />

                               </div>
                                <div className='mt-4 sm:mt-0'>
                                    <div className="font-extrabold text-2xl">
                                        {e.title}
                                    </div>

                                    <div className='text-sm mb-2'>
                                        {date.format('dddd, MMMM D, YYYY h:mm A')}
                                    </div>

                                    <div className='text-gray-500 font-medium text-sm'>
                                        {e.is_members_only ? "Public Event" : "Members Only Event"}
                                    </div>

                                    <div className='text-gray-500 font-medium text-sm'>
                                        Duration: {dayjs.duration({minutes: e.duration_in_minutes}).humanize()} (approx)
                                    </div>

                                    <div className='text-blue-500 font-medium text-sm'>
                                        {e.number_of_registrations}+ Registrations
                                    </div>


                                </div>

                            </div>
                        </Link>
                    )
                })}


            </div>

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
