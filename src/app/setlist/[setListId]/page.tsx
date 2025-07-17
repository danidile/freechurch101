import SetlistPage from "./setlistPage";

export default async function page({
  params,
}: {
  params: Promise<{ setListId: string }>;
}) {
  const awaitedParams = await params;
  return <SetlistPage setListId={awaitedParams.setListId} />;
}
