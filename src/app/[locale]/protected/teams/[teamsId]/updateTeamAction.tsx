"use server";
import { createClient } from "@/utils/supabase/server";
import { churchMembersT, teamData } from "@/utils/types/types";

export const updateTeamAction = async (formData: teamData) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("church-teams")
    .update({
      team_name: formData.team_name,
      is_worship: formData.is_worship,
    })
    .eq("id", formData.id);
  console.log(data);

  if (error) {
    console.log("Error in insert to church-teams", error);
    return {
      success: false,
      message: error.message,
    };
  }
};
