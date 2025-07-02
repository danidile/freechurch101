import isTeamLeaderServer from "@/utils/supabase/isTeamLeaderServer";
import AddSetlistComponent from "./addSetlistComponent";
import userDataServer from "@/utils/supabase/getUserDataServer";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";

export default async function songs() {
  return <AddSetlistComponent />;
}
