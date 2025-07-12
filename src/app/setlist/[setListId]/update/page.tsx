import userDataServer from "@/utils/supabase/getUserDataServer";
import UpdateSetlistComponent from "./updateSetlistComponent";
import isTeamLeaderServer from "@/utils/supabase/isTeamLeaderServer";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { checkPermission } from "@/utils/supabase/permissions/checkPermission";
export default async function songs({
  params,
}: {
  params: { setListId: string };
}) {
  const userData = await userDataServer();

  const allowed = await checkPermission(
    userData.teams,
    "setlists",
    "edit",
    userData.id
  );

  if (allowed) {
    return (
      <div className="container-sub">
        <UpdateSetlistComponent setListId={params.setListId} />
      </div>
    );
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
