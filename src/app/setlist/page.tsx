import isTeamLeader from "@/utils/supabase/isTeamLeader";
import SetListListComponent from "./setListListComponent";

export default async function Page() {
  const isLeader = await isTeamLeader();
  return (
    <>
      <SetListListComponent />
    </>
  );
}
