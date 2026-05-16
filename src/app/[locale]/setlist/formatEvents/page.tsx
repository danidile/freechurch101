import { getAllSetListSongs } from "@/hooks/GET/getAllSetListSongs";
import { setListSongT } from "@/utils/types/types";
import { Button } from "@heroui/button";
import { formatSetlistSongs } from "./formatSetlistSongsAction";
import { FormatSetlistSongs } from "./FormatSetlistSongs";

export default async function Page() {
  let setlistsongs: setListSongT[] = await getAllSetListSongs();

  return <FormatSetlistSongs setlistsongs={setlistsongs} />;
}
