"use client";
import { getSetList } from "@/hooks/GET/getSetList";
import { scheduleTemplate, setListT } from "@/utils/types/types";
import { useUserStore } from "@/store/useUserStore";
import { useState, useEffect } from "react";
import { Alert, Link } from "@heroui/react";
import ChurchLabLoader from "@/app/components/churchLabSpinner";
import LoginForm from "@/app/(auth-pages)/login/loginForm";
import { getSetlistSchedule } from "@/hooks/GET/getSetlistSchedule";
import { getSetListTeams } from "@/hooks/GET/getSetListTeams";
import { GroupedMembers } from "@/utils/types/types";
import { getScheduleTemplateById } from "@/hooks/GET/getScheduleTemplateById";
import SetlistSchedule from "@/app/setlist/[setListId]/setlistScheduleC";

export default function ScheduleTemplateC({
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
        <Link
          href={`/protected/church/personalize/schedule-template/${templateId}/update`}
        >
          Aggiorna
        </Link>

        <SetlistSchedule schedule={schedule.schedule} />
      </div>
    </div>
  );
}
