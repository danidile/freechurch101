"use server";
import { createClient } from "@/utils/supabase/server";

export const getProfileSetList = async (prodileId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event-team")
    .select("id,setlist(id,date,event_title,event_type),team(team_name),status")
    .eq("member", prodileId);

  if (error) {
    console.log(error);
  } else {
    const result = data.map((event: any) => {
      return {
        id: event.id,
        setlist_id: event.setlist.id,
        team_name: event.team.team_name,
        event_title: event.setlist.event_title,
        event_type: event.setlist.event_type,
        date: event.setlist.date,
        status: event.status,
      };
    });

    return result;
  }
};
