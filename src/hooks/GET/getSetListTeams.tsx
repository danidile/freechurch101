"use server";
import { createClient } from "@/utils/supabase/server";
import {
  churchMembersT,
  GroupedMembers,
  setListSongT,
} from "@/utils/types/types";

export const getSetListTeams = async (setlistId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("event-team")
    .select(
      "id,member(id, name, lastname),team(team_name),temp_profile(id, name, lastname),status"
    )
    .eq("setlist", setlistId);

  if (error) {
    console.log(error);
  } else {
    const result = data.map((member: any) => {
      return {
        id: member.id,
        team_name: member.team.team_name,
        profile: member.member ? member.member.id : member.temp_profile.id,
        name: member.member ? member.member.name : member.temp_profile.name,
        lastname: member.member
          ? member.member.lastname
          : member.temp_profile.lastname,
        status: member.status,
      };
    });
    const groupedByTeam = result.reduce<GroupedMembers>((acc, item) => {
      if (!acc[item.team_name]) {
        acc[item.team_name] = [];
      }
      acc[item.team_name].push(item);
      return acc;
    }, {});
    console.log("groupedByTeam");
    console.log(groupedByTeam);
    return groupedByTeam;
  }
};
