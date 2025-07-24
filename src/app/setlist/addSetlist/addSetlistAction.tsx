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
import { logEvent } from "@/utils/supabase/log";

export const addSetlist = async (formData: setListT) => {
  const supabase = await createClient();
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
      room: formData.room,
      hour: formData.hour,
      event_type: formData.event_type,
      private: formData.private,
    })
    .select()
    .single();
  if (error) {
    console.log("error in setlist insert", error);
    await logEvent({
      event: "add_setlist_error",
      level: "error",
      user_id: user?.id ?? null,
      meta: {
        message: error.message,
        code: error.code,
        church: church,
        context: "setlist insert",
      },
    });
    return;
  }
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
        lead: member.lead ? true : false, // Ensure lead is a boolean
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
    await logEvent({
      event: "add_setlist_error_event_team",
      level: "error",
      user_id: user?.id ?? null,
      meta: {
        message: errorTeam.message,
        code: errorTeam.code,
        church: church,
        context: "setlist event-team insert",
      },
    });
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
      singer: section.singer,
    }));

    console.log("⚙️ Songs to add", songsDb);

    const { error } = await supabase
      .from("setlist-songs")
      .insert(songsDb)
      .select();
    if (error) {
      console.error(error);
      await logEvent({
        event: "add_setlist_error",
        level: "error",
        user_id: user?.id ?? null,
        meta: {
          message: error.message,
          code: error.code,
          context: "setlist-songs insert",
        },
      });
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
      await logEvent({
        event: "add_setlist_error",
        level: "error",
        user_id: user?.id ?? null,
        meta: {
          message: error.message,
          code: error.code,
          context: "setlist-notes insert",
        },
      });
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
      await logEvent({
        event: "add_setlist_error",
        level: "error",
        user_id: user?.id ?? null,
        meta: {
          message: error.message,
          code: error.code,
          context: "setlist-titles insert",
        },
      });
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
