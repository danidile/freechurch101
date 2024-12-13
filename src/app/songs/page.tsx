import { createClient } from "@/utils/supabase/server";
import SongslistComponent from "./songslistComponent";

export default async function Page() {
  const supabase = createClient();
  const { data: songs } = await supabase.from("songs").select("*");

  if (songs) {
    return (
      <>
        <SongslistComponent songs={songs} />
      </>
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
