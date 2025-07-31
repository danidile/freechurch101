import SetlistSchedule from "@/app/setlist/[setListId]/setlistScheduleC";
import { getScheduleTemplateById } from "@/hooks/GET/getScheduleTemplateById";
import ScheduleTemplateC from "./scheduleTemplateC";

export default async function page({
  params,
}: {
  params: Promise<{ templateid: string }>;
}) {
  const awaitedParams = await params;

  return (
    <>
      <ScheduleTemplateC templateId={awaitedParams.templateid} />
    </>
  );
}
