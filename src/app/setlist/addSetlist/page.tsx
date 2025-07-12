import isTeamLeaderServer from "@/utils/supabase/isTeamLeaderServer";
import AddSetlistComponent from "./addSetlistComponent";
import userDataServer from "@/utils/supabase/getUserDataServer";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { checkPermission } from "@/utils/supabase/permissions/checkPermission";

export default async function songs() {
  const userData = await userDataServer();
  console.log("leaderOf", userData.leaderOf);
  const allowed = await checkPermission(
    userData.teams,
    "setlists",
    "create",
    userData.id
  );
  if (allowed) {
    return <AddSetlistComponent />;
  } else {
    return (
      <div className="container-sub ">
        <div className="max-w-[600px] h-[70vh] flex flex-col justify-center items-center text-center">
          <h3> Accesso negato.</h3>
          <p>
            Solo gli amministratori della chiesa e i responsabili dei team
            possono creare eventi e turnazioni.
          </p>
        </div>
      </div>
    );
  }
}
