import isTeamLeaderServer from "@/utils/supabase/isTeamLeaderServer";
import AddSetlistComponent from "./addSetlistComponent";
import userDataServer from "@/utils/supabase/getUserDataServer";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";

export default async function songs() {
  const isLeader = await isTeamLeaderServer();
  const userData = await userDataServer();

  if (
    isLeader.isLeader ||
    hasPermission(userData.role as Role, "create:setlists")
  ) {
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
