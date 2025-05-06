"use server";
import { createClient } from "@/utils/supabase/server";
import {
  churchMembersT,
  GroupedMembers,
  setListSongT,
} from "@/utils/types/types";

export const getProfileSetList = async (prodileId: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("event-team")
    .select("id,setlist(date,event_title),team(team_name),status")
    .eq("member", prodileId);

  if (error) {
    console.log(error);
  } else {
    const result = data.map((event: any) => {
      return {
        id: event.id,
        team_name: event.team.team_name,
        event_title: event.setlist.event_title,
        date: event.setlist.date,
        status: event.status,
      };
    });

    return result;
  }
};
