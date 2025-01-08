import { redirect } from "next/navigation";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import MyChurch from "./mychurchComponent";
import { createClient } from "@/utils/supabase/server";
import { Team } from "@/utils/types/types";
export default async function App() {
  const userData: basicUserData = await fbasicUserData();
  const supabase = createClient();

  let { data: churchTeams, error } = await supabase
    .from("church-teams")
    .select("*")
    .eq("church", userData.church_id);

  const teamMembers : Team[] = await Promise.all(
    churchTeams.map(async (churchTeam) => {
      const { data: teamMembersFull, error } = await supabase
        .from("team-members")
        .select("*")
        .eq("team_id", churchTeam.id);

      if (error) {
        console.error(
          `Error fetching members for team ${churchTeam.id}:`,
          error
        );
        return null; // Handle error appropriately
      }

      return {
        teamId: churchTeam.id,
        teamName: churchTeam.team_name,
        teamMembers: teamMembersFull || [],
      };
    })
  );

  console.log("Teammenbers");
  console.log( teamMembers);

  if (userData) {
    return (
      <>

        <MyChurch userData={userData} eventPlan={teamMembers} />
      </>
    );
  } else {
    redirect("/login");
  }
}
