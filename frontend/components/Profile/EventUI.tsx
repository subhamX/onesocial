import dayjs from "dayjs";
import Link from "next/link";
import { DETAILED_EVENT } from "../../config/ScreenRoutes";
import { Event } from "../../graphql/generated_graphql_types";
import { Calender } from "./Events";

export function EventUI({ event: e }: { event: Event }): JSX.Element {
  const date = dayjs(parseFloat(e.event_start_time) * 1000);

  return (
    <Link href={DETAILED_EVENT(e.event_id)}>
      <div className="card card-compact my-2 border border-gray-400 bg-gray-50 shadow-xl cursor-pointer flex flex-col sm:grid sm:grid-cols-5 py-6 px-4 hover:bg-slate-50 items-center gap-4">
        <div className="col-span-2 flex gap-2 w-full items-center flex-row-reverse sm:flex-row">
          <Calender
            className="hidden xs:flex w-full flex-grow"
            date={date.format("DD")}
            month={date.format("MMM")}
          />
          <img
            src={e.cover_image_url}
            className="w-full overflow-hidden h-28 object-cover sm:max-w-64 rounded-lg border border-blue-200"
          />
        </div>
        <div className="mt-4 sm:mt-0 break-words w-full col-span-3 col-start-3">
          <div className="font-extrabold text-xl">{e.title}</div>

          <div className="text-sm mb-2">
            {date.format("dddd, MMMM D, YYYY h:mm A")}
          </div>

          <div className="text-gray-500 font-medium text-sm">
            {!e.is_member_only_event ? "Public Event" : "Members Only Event"}
          </div>

          <div className="text-gray-500 font-medium text-sm">
            Duration:{" "}
            {dayjs.duration({ minutes: e.duration_in_minutes }).humanize()}{" "}
            (approx)
          </div>

          <div className="text-blue-500 font-medium text-sm">
            {e.number_of_registrations}+ Registrations
          </div>
        </div>
      </div>
    </Link>
  );
}
