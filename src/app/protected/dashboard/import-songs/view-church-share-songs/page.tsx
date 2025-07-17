import ViewChurchSongsShareList from "./viewChurchSongsShareListComponent";
import { getSongsByShareCode } from "@/hooks/GET/getSongsByShareCode";

export default async function App({
  searchParams,
}: {
  searchParams: Promise<any>;
}) {
  const awaitedParams = await searchParams;

  const songs = await getSongsByShareCode(awaitedParams.success);
  return (
    <div className="container-sub">
      <ViewChurchSongsShareList songsList={songs} />
    </div>
  );
}
