"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { setListT, teamData } from "@/utils/types/types";

export const addSetlist = async (formData: setListT) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();
  const church: string = profile.church;

  const { data, error } = await supabase
    .from("setlist")
    .insert({
      id: formData.id,
      church: church,
      created_by: user?.id,
      date: formData.date,
      event_title: formData.event_title,
    })
    .select()
    .single();

  const sectionId = data.id;
  let expandedTeam: any = [];
  formData.teams.map((team: teamData) => {
    team.selected.map((member: any) => {
      expandedTeam.push({
        setlist: sectionId,
        member: member.profile,
        team: team.id,
      });
    });
  });
  console.log("expandedTeam");
  console.log(expandedTeam);
  const { error: errorTeam } = await supabase
    .from("event-team")
    .insert(expandedTeam)
    .select();
  console.log("errorTeam");
  console.log(errorTeam);
  formData.setListSongs.map(async (section, index) => {
    console.log(section);
    if (section.type === "songs") {
      const { error } = await supabase
        .from("setlist-songs")
        .insert({
          setlist_id: sectionId,
          song: section.song,
          key: section.key,
          order: index,
        })
        .select();
    } else if (section.type === "global-songs") {
      const { error } = await supabase.from("setlist-songs").insert({
        setlist_id: sectionId,
        global_song: section.song,
        key: section.key,
        order: index,
      });
    }
    console.log(error);
  });

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
