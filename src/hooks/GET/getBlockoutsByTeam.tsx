"use client";

import { createClient } from "@/utils/supabase/client";
type ProfileData = {
  profile: {
    id: string;
    name: string;
    lastname: string;
  };
  team_id: {
    team_name: string;
  };
};

type SupabaseResponse = {
  data: ProfileData[] | null;
  error: Error | null; // Add error here
};

export const getBlockoutsByTeamId = async (teamId: string) => {
  const supabase = await createClient();
  if (teamId) {
    const { data: teamMembers, error: teamError } = (await supabase
      .from("team-members")
      .select("profile(id, name, lastname),team_id(team_name)")
      .eq("team_id", teamId)) as unknown as SupabaseResponse;

    if (teamError) {
      console.log("error in select team-members on getBlockoutsByTeamId");
      return;
    }

    if (teamMembers) {
      const teamName = teamMembers[0]?.team_id.team_name ?? "Unnamed Team";
      const ids = teamMembers.map((item) => item.profile.id);
      const today = new Date().toISOString().split("T")[0];

      const { data: blockouts, error: blockoutsError } = await supabase
        .from("blockouts")
        .select("id, profile, start, end")
        .in("profile", ids)
        .or(`start.gte.${today},end.gte.${today}`);

      if (blockoutsError) {
        console.log("error in fetching blockouts");
        return;
      }

      // 🔁 Build final structured array
      const result = teamMembers.map((member) => {
        const profileId = member.profile.id;
        return {
          id: profileId,
          name: member.profile.name,
          lastname: member.profile.lastname,
          blockouts: blockouts
            ?.filter((b) => b.profile === profileId)
            .map(({ start, end }) => ({ start, end })),
        };
      });

      const team = {
        team_name: teamName,
        team_id: teamId,
        teamMembers: result,
      };
      console.log("team", team);
      return team;
    }
  } else {
    console.log("teamId is necessary");
  }
};
