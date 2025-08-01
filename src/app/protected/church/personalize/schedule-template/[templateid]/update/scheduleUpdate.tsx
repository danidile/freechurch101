"use client";
import { getSetList } from "@/hooks/GET/getSetList";
import { scheduleTemplate, setListT } from "@/utils/types/types";
import { useUserStore } from "@/store/useUserStore";
import { useState, useEffect } from "react";
import { Alert } from "@heroui/react";
import ChurchLabLoader from "@/app/components/churchLabSpinner";
import LoginForm from "@/app/(auth-pages)/login/loginForm";
import { getSetlistSchedule } from "@/hooks/GET/getSetlistSchedule";
import { getSetListTeams } from "@/hooks/GET/getSetListTeams";
import { GroupedMembers } from "@/utils/types/types";
import { getScheduleTemplateById } from "@/hooks/GET/getScheduleTemplateById";
import SetlistSchedule from "@/app/setlist/[setListId]/setlistScheduleC";
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
        <EventScheduleTemplate schedulePre={schedule.schedule} />
      </div>
    </div>
  );
}
