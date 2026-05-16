"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "@/i18n/navigation";

export default async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
