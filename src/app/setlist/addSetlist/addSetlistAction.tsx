"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import {
  expandedTeamT,
  setListSongT,
  setListT,
  songType,
  teamData,
} from "@/utils/types/types";

export const addSetlist = async (formData: setListT) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // GET profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();
  const church: string = profile.church;

  // Create Setlist

  const { data, error } = await supabase
    .from("setlist")
    .insert({
      id: formData.id,
      church: church,
      created_by: user?.id,
      date: formData.date,
      event_type: formData.event_type,
      private: formData.private,
      color: formData.color,
    })
    .select()
    .single();
  // Take the id of the setlist just created
  const sectionId = data.id;

  // Format Team

  let expandedTeam: expandedTeamT[] = [];
  formData.teams.map((team: teamData) => {
    team.selected.map((member: any) => {
      expandedTeam.push({
        setlist: sectionId,
        member: member.profile,
        team: team.id,
        roles: member.selected_roles,
      });
    });
  });
  console.log("expandedTeam");
  console.log(expandedTeam);

  //Insert Team

  const { error: errorTeam } = await supabase
    .from("event-team")
    .insert(expandedTeam)
    .select();
  if (errorTeam) {
    console.error("errorTeam", errorTeam);
  }

  // Separate by type
  const songs = formData.schedule
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter((item) => item.type === "song");

  const notes = formData.schedule
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter((item) => item.type === "note");

  const titles = formData.schedule
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter((item) => item.type === "title");

  if (songs.length >= 1) {
    let songsDb: setListSongT[] = songs.map((section, index) => ({
      setlist_id: sectionId,
      song: section.song,
      key: section.key,
      order: section.originalIndex,
    }));

    console.log("⚙️ Songs to add", songsDb);

    const { error } = await supabase
      .from("setlist-songs")
      .insert(songsDb)
      .select();
    if (error) {
      console.error(error);
    } else {
      console.log("✅ Songs updated Successfully");
    }
  }

  if (notes.length >= 1) {
    const notesDb: setListSongT[] = notes.map((section, index) => ({
      setlist_id: sectionId,
      note: section.note,
      order: section.originalIndex,
    }));
    console.log("⚙️ Notes to add", notesDb);

    const { error } = await supabase
      .from("setlist-notes")
      .insert(notesDb)
      .select();
    if (error) {
      console.error(error);
    } else {
      console.log("✅ Notes updated Successfully");
    }
  }
  console.log("⚙️ titles PRE", titles);

  if (titles.length >= 1) {
    let titlesDb: setListSongT[] = titles.map((section) => ({
      setlist_id: sectionId,
      title: section.title,
      order: section.originalIndex,
    }));

    console.log("⚙️ Titles to add", titlesDb);

    const { error } = await supabase
      .from("setlist-titles")
      .insert(titlesDb)
      .select();
    if (error) {
      console.error(error);
    } else {
      console.log("✅ Titles updated Successfully");
    }
  }

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      `/setlist/${sectionId}`,
      "SetList Registrata con successo!"
    );
  }
};
