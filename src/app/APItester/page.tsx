import { getChurchTeams } from "@/hooks/GET/getChurchTeams";
import { createClient } from "@/utils/supabase/server";

export default async function Tester() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("data");
  console.log(user);
}
