import { createClient } from "@/utils/supabase/server";
import SongslistComponent from "./songslistComponent";




type songsListType = {
  songs:{
    id: string;
    created_at: string;
    song_title: string;
    lyrics: string;
    author: string;
    upload_key: string;
  }[];
};





export default async function Page() {
  const supabase = createClient();
  const { data: songs,error } = await supabase.from("songs").select("*");
  console.log(songs);
  if (error) {
    console.error("Errore durante il fetch:", error);
  }

  const songList: songsListType = { songs: songs || [] }; // Avvolgi l'array in un oggetto


  if (songs) {
    return (
      <div className="container-sub">
        <SongslistComponent songs={songList.songs} />
      </div>
    );
  } else {
    return (
      <>
        <h1>No song found</h1>
        <a href="/songs/addSong">Add a New Song!</a>
      </>
    );
  }
}
