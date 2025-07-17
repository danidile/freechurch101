import { createClient } from "@/utils/supabase/server";

export default async function fchurchMembers({
  churchId,
}: {
  churchId: string;
}) {
  const supabase = await createClient();

  const { data: churchMembers, error: profileError } = await supabase
    .from("profiles")
    .select("name ,lastname, role, email") // Assuming role_id is a foreign key to the roles table
    .eq("church", churchId);

  return churchMembers;
}
