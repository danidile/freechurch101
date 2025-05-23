// import { getAllSetListSongs } from "@/hooks/GET/getAllSetListSongs";
// import { setListSongT } from "@/utils/types/types";
// import { Button } from "@heroui/button";
// import { formatSetlistSongs } from "./formatSetlistSongsAction";
// import { FormatSetlistSongs } from "./FormatSetlistSongs";

// export default async function Page({
//   params,
// }: {
//   params: { setListId: string };
// }) {
//   let setlistsongs: setListSongT[] = await getAllSetListSongs();
//   const formattaCanzoni = async (data: setListSongT[]) => {
//     await formatSetlistSongs(data);
//     console.log("songs ImpoRted");
//   };
//   return <FormatSetlistSongs setlistsongs={setlistsongs} />;
// }
