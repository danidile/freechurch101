
import TeamIdComponent from "./TeamComponent";


export default async function Page({
  params,
}: {
  params: Promise<any>;
}) {
  const awaitedParams = await params;

  return <TeamIdComponent params={awaitedParams} />;
}
