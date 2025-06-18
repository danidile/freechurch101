"use server";
import { createClient } from "@/utils/supabase/server";
import { GroupedMembers } from "@/utils/types/types";

export const getSetListTeams = async (setlistId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("event-team")
    .select(
      "id, member(id, name, lastname,email,phone),team(team_name),status,roles"
    )
    .eq("setlist", setlistId);

  if (error) {
    console.log(error);
  } else {
    const result = data.map((member: any) => {
      return {
        id: member.id,
        team_name: member.team.team_name,
        profile: member.member.id,
        name: member.member.name,
        lastname: member.member.lastname,
        status: member.status,
        selected_roles: member.roles,
        email: member.member.email,
        phone: member.member.phone,
      };
    });
    const groupedByTeam = result.reduce<GroupedMembers>((acc, item) => {
      if (!acc[item.team_name]) {
        acc[item.team_name] = [];
      }
      acc[item.team_name].push(item);
      return acc;
    }, {});

    return groupedByTeam;
  }
};
