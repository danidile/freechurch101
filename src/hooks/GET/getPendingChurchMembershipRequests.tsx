"use server";

import { createClient } from "@/utils/supabase/server";
import { pendingRequestsT } from "@/utils/types/types";

export const getPendingChurchMembershipRequests = async (churchId: string) => {
  const supabase = createClient();
  const { data: pendingRequests, error } = await supabase
    .from("church-membership-request")
    .select("id, created_at, profile:profile!inner(id,name,lastname,email)")
    .eq("church", churchId);
  if (error) {
    console.log("error", error);
  }
  const mappedData: pendingRequestsT[] = pendingRequests.map((item) => ({
    id: item.id,
    created_at: item.created_at,
    profile: Array.isArray(item.profile) ? item.profile[0] : item.profile, // Assicura che sia un oggetto
  }));

  console.log("pendingRequests");
  console.log(pendingRequests);
  return mappedData;
};
