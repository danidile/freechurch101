
import SetlistPage from "./setlistPage";

export default async function Page({
  params,
}: {
  params: { setListId: string };
}) {
  return <SetlistPage  setListId={params.setListId} />;
}
