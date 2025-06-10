"use server";
import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { expandedTeamT, setListT, teamData } from "@/utils/types/types";

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
      event_title: formData.event_title,
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
  console.log("errorTeam");
  console.log(errorTeam);

  //Insert Songs

  formData.setListSongs.map(async (section, index) => {
    const { error } = await supabase
      .from("setlist-songs")
      .insert({
        setlist_id: sectionId,
        song: section.song,
        key: section.key,
        order: index,
      })
      .select();

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
