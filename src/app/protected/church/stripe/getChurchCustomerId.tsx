"use server";

import { createClient } from "@/utils/supabase/server";

type ProfilesRow = {
  church: { stripe_customer_id: string }; // attenzione: array
};
type SupabaseResponse = {
  data: ProfilesRow | null;
  error: Error | null; // Add error here
};

export const getChurchCustomerId = async (): Promise<string | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = (await supabase
    .from("profiles")
    .select("church(stripe_customer_id)")
    .eq("id", user.id)
    .single()) as unknown as SupabaseResponse;

  if (error) {
    console.error("Error fetching CustomerID:", error);
    return null;
  }

  console.log("customerId", data);
  return data?.church?.stripe_customer_id ?? null;
};
