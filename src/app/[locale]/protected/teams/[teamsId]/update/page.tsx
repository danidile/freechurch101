import UpdateTeamForm from "./updateTeamForm";
export default async function songs({ params }: { params: Promise<any> }) {
  const awaitedParams = await params;

  return (
    <div className="container-sub">
      <UpdateTeamForm params={awaitedParams} />
    </div>
  );
}
