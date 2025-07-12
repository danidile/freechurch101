import userDataServer from "@/utils/supabase/getUserDataServer";
import EmailSenderC from "./sendemails/EmailSenderC";
import { checkPermission } from "@/utils/supabase/permissions/checkPermission";

export default async function Page() {
  const userData = await userDataServer();
  const allowed = await checkPermission(
    userData.teams,
    "setlists",
    "edit",
    userData.id
  );
  return (
    <>
      {allowed ? <p>Allowed</p> : <p>Not Allowed</p>}
    </>
  );
}
