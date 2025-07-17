"use server";

import { createClient } from "@/utils/supabase/server";
import { GroupedMembers } from "@/utils/types/types";
import { getSetListTeams } from "./getSetListTeams";

export const getSetListsByChurch = async (churchId: string) => {
  const supabase = await createClient();
  let setlistsFull;
  const { data: setlist, error } = await supabase
    .from("setlist")
    .select("id,event_type,date,private,color,hour")
    .eq("church", churchId)
    .order("date", { ascending: true });
  if (setlist) {
    setlistsFull = await Promise.all(
      setlist.map(async (singleSetlist) => {
        const setlistTeams: GroupedMembers = await getSetListTeams(
          singleSetlist.id
        );
        return {
          ...singleSetlist,
          setlistTeams: setlistTeams,
        };
      })
    );
  }
  if (error) {
    console.error("Error fetching setlist:", error);
    return null;
  }
  return setlistsFull;
};
