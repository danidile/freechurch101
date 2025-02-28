"use server";
import { churchMembersT, setListT, teamData } from "@/utils/types/types";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

export const updateSetlist = async (
  churchTeamUpdated: teamData,
  churchTeamStart: teamData
) => {
  // CHECK AND UPDATE church-teams TABLE

  let hasChanged: boolean = false;

  if (
    churchTeamUpdated.is_worship !== churchTeamStart.is_worship ||
    churchTeamUpdated.team_name !== churchTeamStart.team_name
  ) {
    hasChanged = true;
  }
  const supabase = createClient();
  if (hasChanged) {
    const { data, error } = await supabase
      .from("church-teams")
      .update({
        team_name: churchTeamUpdated.team_name,
        is_worship: churchTeamUpdated.is_worship,
      })
      .eq("id", churchTeamStart.id)
      .select()
      .single();

    if (error) {
      console.log("\x1b[41m Error in Team Data insert \x1b[0m");
      console.log(error);
    } else {
      console.log("\x1b[42m Success in Team Data insert \x1b[0m");
    }
  } else {
    console.log("\x1b[42m Team Data was not changed \x1b[0m");
  }
  // END OF OCHECK AND UPDATE church-teams TABLE

  // CHECK AND UPDATE team-members TABLE

  // mappo attraverso le setlist di setlistData e inserisco il valore della setlist dentro updatedSetlist con lo stesso index
  // in questo modo garantisco che gli setlistID sono gli stessi e nel caso in cui devo cancellare un campo devo solo
  // controllare se il campo song del della setlist è vuota. Se è vuola vuol dire che c'era una setlist ma è stat cancellata

  churchTeamStart.team_members.map((member, index) => {
    if (churchTeamUpdated.team_members[index]) {
      churchTeamUpdated.team_members[index].id = member.id;
    } else {
      churchTeamUpdated.team_members.push({
        id: member.id,
      });
    }
  });

  let newTeam: churchMembersT[] = [];
  let idsToDelete: string[] = [];

  churchTeamUpdated.team_members.map(
    async (teamMember: churchMembersT, index: number) => {
      if (teamMember.profile) {
        newTeam.push({
          id: teamMember?.id || crypto.randomUUID(),
          profile: teamMember.profile,
          roles: teamMember.roles,
          team_id: churchTeamStart.id,
        });
      } else {
        console.log(
          "\x1b[36m%s\x1b[0m",
          "Team Member " + index + " has been removed from the team"
        );
        idsToDelete.push(teamMember.id);
      }
    }
  );
  console.log("churchTeamUpdated");
  console.log(churchTeamUpdated);
  console.log("newTeam");
  console.log(newTeam);

  const { data, error } = await supabase
    .from("team-members")
    .upsert(newTeam, { onConflict: "id" });
  if (error) {
    console.log("\x1b[36m%s\x1b[0m", "ERROR");
    console.log("\x1b[36m%s\x1b[0m", error);
  } else {
    console.log("\x1b[36m%s\x1b[0m", "SUCCESS");
    console.log("\x1b[36m%s\x1b[0m", data);
  }

  if (idsToDelete.length > 0) {
    idsToDelete.map(async (id, index) => {
      console.log("\x1b[36m%s\x1b[0m", "SUCCESS");

      const { error } = await supabase
        .from("team-members")
        .delete()
        .eq("id", id);
      if (error) {
        console.log("\x1b[36m%s\x1b[0m", error);
      }
    });
  }

  //   const { error } = await supabase
  //     .from("setlist-songs")
  //     .delete()
  //     .eq("id", song.id);
  //

  // if (error) {
  //   console.error(error.code + " " + error.message);
  //   console.log("\x1b[36m%s\x1b[0m", "ERRRRRROR");
  //   return encodedRedirect("error", "/sign-up", error.message);
  // }
  // else {
  //
  // }
  // });
  return encodedRedirect(
    "success",
    `/protected/teams/${churchTeamStart.id}`,
    "Team aggiornato con successo!"
  );
};
