import { getSongsCompact } from "@/hooks/GET/getSongsCompact";
import UpdateSetlistForm from "../[setListId]/update/UpdateSetlistForm";
export default async function songs() {
  const songs = await getSongsCompact();
  const setlistData :null = null;
  return (
    <div className="container-sub">
    <UpdateSetlistForm page="create" setlistData={setlistData} songsList={songs} />
      
      {/* <CreateSetlistForm songsList={songs} /> */}
    </div>
  );
}
