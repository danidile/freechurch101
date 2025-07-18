import { createClient } from "@/utils/supabase/server";
import { basicUserData } from "@/utils/types/userData";

type ProfileData = {
  name: string;
  lastname: string;
  role?: { role_name: string }; // role is an object, not an array
  phone?: string;

  church: {
    logo?: string | null;
    id?: string | null;
    church_name?: string | null;
  };
};

type SupabaseResponse = {
  data: ProfileData | null;
  error: Error | null; // Add error here
};

export default async function userDataServer() {
  let userData: basicUserData = {
    loggedIn: false,
    role: "user",
    fetched: true,
  };

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.log("Not logged in:", userError.message);
    return userData;
  }

  if (user) {
    const { data, error } = (await supabase
      .from("profiles")
      .select(
        "name, lastname, role(role_name), church(id,church_name,logo),phone"
      )
      .eq("id", user.id)
      .single()) as unknown as SupabaseResponse;
    userData = {
      loggedIn: true,
      id: user?.id || null,
      email: user?.email || null,
      phone: data?.phone || null,
      name: data?.name || null,
      lastname: data?.lastname || null,
      role: data?.role?.role_name || "user",
      church_id: data?.church?.id || null,
      church_name: data?.church?.church_name || null,
      church_logo: data?.church?.logo || null,
    };
    if (error) {
      console.error("Error fetching profile:", error.message);
      return userData;
    }
    let churchpending: boolean = false;
    if (!data || !data.church) {
      let { data: churchMembershipRequest } = await supabase
        .from("church-membership-request")
        .select("*")
        .eq("profile", user.id);
      console.log("churchMembershipRequest");
      console.log(churchMembershipRequest);
      if (churchMembershipRequest.length > 0) {
        churchpending = true;
        userData.pending_church_confirmation = churchpending;
      }
    }
    let { data: teams, error: teamError } = await supabase
      .from("team-members")
      .select("*")
      .eq("profile", user.id);
    if (error) {
      console.error("Error fetching profile:", error.message);
      return userData;
    }
    const teamLead = teams
      .filter((team) => team.role === "leader")
      .map((team) => team.team_id);
    const ids = teams.map((team) => team.team_id);
    userData.teams = ids;
    userData.leaderOf = teamLead;
  }

  return userData;
}
