"use client";

import Link from "next/link";
import { Button } from "@heroui/button";
import { ScheduleViewComponents } from "./ScheduleViewComponents";

interface SetlistScheduleProps {
  schedule: any[];
  setListId?: string;
}

export default function SetlistSchedule({
  schedule,
  setListId,
}: SetlistScheduleProps) {
  if (!schedule || schedule.length === 0) return null;

  return (
    <>
      <h5 className="font-medium">Scaletta</h5>
      <div className="mb-2 px-1 py-4">
        {schedule.map((element, index) => (
          <div key={index}>
            <ScheduleViewComponents element={element} />
          </div>
        ))}
      </div>
    </>
  );
}
