"use client";
import Link from "next/link";
import { scheduleTemplate } from "@/utils/types/types";

export default function ScheduleListComponent({
  schedules,
}: {
  schedules: scheduleTemplate[];
}) {
  console.log(schedules);

  return (
    <div className="max-w-[1324px]">
      
      <div className="container-song-list w-full min-w-[300px] mx-auto">
        {schedules.map((template) => (
          <div key={template.id}>
            <div>
              <Link
                href={`/protected/church/personalize/schedule-template/${template.id}`}
              >
                <span className="font-medium line-clamp-1">
                  {template.name}
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
