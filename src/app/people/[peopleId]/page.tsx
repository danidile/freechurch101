
import PeopleIdComponent from "./peopleIdComponent";

export default async function Page({
  params,
}: {
  params: { peopleId: string };
}) {
  return <PeopleIdComponent params={params} />;
}
