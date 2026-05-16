"use server";
import { churchMembersT, setListT, teamData } from "@/utils/types/types";
import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

const updateTeamData = async (
  churchTeamUpdated: teamData,
  churchTeamStart: teamData
) => {
  let hasChanged: boolean = false;
  if (churchTeamUpdated.team_name !== churchTeamStart.team_name) {
    hasChanged = true;
    console.log("\x1b[41m Team Name has been changed \x1b[0m");
    console.log(churchTeamStart.id);
  }
  const supabase = await createClient();
  if (hasChanged) {
    const { data, error } = await supabase
      .from("church-teams")
      .update({
        team_name: churchTeamUpdated.team_name,
      })
      .eq("id", churchTeamStart.id)
      .select();
    if (error) {
      console.log("\x1b[41m Error in Team Data insert church-teams \x1b[0m");
      console.log(error);
    } else {
      console.log("\x1b[42m Success in Team Data insert \x1b[0m");
    }
  } else {
    console.log("\x1b[42m Team Data was not changed \x1b[0m");
  }
};
const upsertTeam = async (
  churchTeamUpdated: teamData,
  churchTeamStart: teamData
) => {
  churchTeamStart.team_members.map((member, index) => {
    if (churchTeamUpdated.team_members[index]) {
      churchTeamUpdated.team_members[index].id = member.id;
    } else {
      churchTeamUpdated.team_members.push(member);
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
          "Team Member " +
            churchTeamUpdated.team_members[index].name +
            " has been removed from the team"
        );
        idsToDelete.push(teamMember.id);
      }
    }
  );
  console.log("newTeam");
  console.log(newTeam);

  const supabase = await createClient();

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

  //delete team members if necessary
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
};

export const updateTeam = async (
  churchTeamUpdated: teamData,
  churchTeamStart: teamData
) => {
  // CHECK AND UPDATE church-teams TABLE
  updateTeamData(churchTeamUpdated, churchTeamStart);
  upsertTeam(churchTeamUpdated, churchTeamStart);

  return encodedRedirect(
    "success",
    `/protected/teams/${churchTeamStart.id}`,
    "Team aggiornato con successo!"
  );
};
