import PeopleIdComponent from "./peopleIdComponent";

export default async function Page({
  params,
}: {
  params: Promise<any>;
}) {
  const awaitedParams = await params;

  return <PeopleIdComponent params={awaitedParams} />;
}
