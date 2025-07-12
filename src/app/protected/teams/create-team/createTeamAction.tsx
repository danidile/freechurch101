"use server";
import { createClient } from "@/utils/supabase/server";
import { churchMembersT, teamData } from "@/utils/types/types";

export const createTeam = async (formData: teamData) => {
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
    .from("church-teams")
    .insert({
      church: church,
      team_name: formData.team_name,
      is_worship: formData.is_worship,
    })
    .select()
    .single();
  console.log(data);

  if (error) {
    console.log("Error in insert to church-teams", error);
    return {
      success: false,
      message: error.message,
    };
  }
  const teamId = data.id;

  const newMembersArray: churchMembersT[] = [];
  formData.team_members.map((member: churchMembersT, index: number) => {
    newMembersArray[index] = {
      team_id: teamId,
      roles: member.roles,
      profile: member.profile,
    };
  });
  const { error: errorTeamMembers } = await supabase
    .from("team-members")
    .insert(newMembersArray)
    .select();
  if (errorTeamMembers) {
    console.log(errorTeamMembers);
  }
  console.log(teamId);
  if (error) {
    console.error(error.code + " " + error.message);
    return {
      success: false,
      message: error.message,
    };
  } else {
    return {
      success: true,
      data: teamId,
    };
  }
};
