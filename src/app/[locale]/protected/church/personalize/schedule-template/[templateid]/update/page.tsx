import ScheduleUpdate from "./scheduleUpdate";

export default async function page({
  params,
}: {
  params: Promise<{ templateid: string }>;
}) {
  const awaitedParams = await params;

  return (
    <>
      <ScheduleUpdate templateId={awaitedParams.templateid} />
    </>
  );
}
