"use server";

import { createClient } from "@/utils/supabase/server";

export const getInviteByToken = async (token: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("pending_invites")
    .select("*, church(id, church_name,logo)")
    .eq("token", token)
    .single();

  if (error) {
    return {
      success: false,
      message: "Nessun invito trovato per questo token.",
    };
  } else {
    const response = {
      id: data?.id || null,
      email: data?.email || null,
      name: data?.name || null,
      lastname: data?.lastname || null,
      church_id: data?.church?.id || null,
      church_name: data?.church?.church_name || null,
      church_logo: data?.church?.logo || null,
      status: data?.status || null,
    };
    return {
      success: true,
      data: response,
    };
  }
};
