
import UpdateSetlistComponent from "./updateSetlistComponent";
export default async function songs({
  params,
}: {
  params: { setListId: string };
}) {
  return (
    <div className="container-sub">
      <UpdateSetlistComponent setListId={params.setListId} />
    </div>
  );
}
