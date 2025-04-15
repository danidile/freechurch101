import ViewChurchSongsShareList from "./viewChurchSongsShareListComponent";
import { getSongsByShareCode } from "@/hooks/GET/getSongsByShareCode";

export default async function App({
  searchParams,
}: {
  searchParams: { success?: string };
}) {
  const songs = await getSongsByShareCode(searchParams.success);
  return (
    <div className="container-sub">
      <ViewChurchSongsShareList songsList={songs} />
    </div>
  );
}
