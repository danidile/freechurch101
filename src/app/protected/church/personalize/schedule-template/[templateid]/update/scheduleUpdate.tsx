"use client";
import { scheduleTemplate } from "@/utils/types/types";
import { useState, useEffect } from "react";
import ChurchLabLoader from "@/app/components/churchLabSpinner";
import { getScheduleTemplateById } from "@/hooks/GET/getScheduleTemplateById";
import EventScheduleTemplate from "../../add/eventScheduleTemplate";

export default function ScheduleUpdate({
  templateId,
}: {
  templateId: string;
}) {
  const [schedule, setSchedule] = useState<scheduleTemplate>(null);
  // Fetch all setlist data
  useEffect(() => {
    if (templateId) {
      console.time("fetchSetlistData");
      const fetchTemplate = async () => {
        const fetchedSchedule = await getScheduleTemplateById(templateId);
        setSchedule(fetchedSchedule);

        console.timeEnd("fetchSetlistData");
      };

      fetchTemplate();
    }
  }, [templateId]);

  if (!schedule) {
    return <ChurchLabLoader />;
  }

  return (
    <div className="container-sub">
      <div className="song-presentation-container">
        {" "}
        <EventScheduleTemplate type="update" schedulePre={schedule} />
      </div>
    </div>
  );
}
