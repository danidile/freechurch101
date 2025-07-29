"use server";
import { createClient } from "@/utils/supabase/server";

export const getSetlistTeamLeadBySetlistAndUserId = async (
  prodileId: string,
  setlistId: string
) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event-team")
    .select("team")
    .eq("member", prodileId)
    .eq("setlist", setlistId)
    .eq("lead", true);
  if (error) {
    console.log(error);
  } else {
    const result = data.map((team) => {
      return {
        team_id: team.team,
        role: "editor",
      };
    });
    return result;
  }
};
