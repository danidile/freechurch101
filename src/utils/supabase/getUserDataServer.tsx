import { createClient } from "@/utils/supabase/server";
import { basicUserData } from "@/utils/types/userData";

type ProfileData = {
  name: string;
  lastname: string;
  role?: { role_name: string }; // role is an object, not an array
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
const roles = [
  { key: 0, label: "Admin", slug: "admin" },
  { key: 1, label: "Fondatore Chiesa", slug: "churchfounder" },
  { key: 2, label: "Admin Chiesa", slug: "churchadmin" },
  { key: 3, label: "Team Leader", slug: "teamleader" },
  { key: 8, label: "Membro Chiesa", slug: "churchmember" },
  { key: 9, label: "User senza profilo //Logged out", slug: "user" },
];
export default async function userDataServer() {
  let userData: basicUserData = {
    loggedIn: false,
    role: "user",
    fetched: true,
  };

  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Not logged in:", userError.message);
    return userData;
  }

  if (user) {
    const { data, error } = (await supabase
      .from("profiles")
      .select("name, lastname, role(role_name), church(id,church_name)")
      .eq("id", user.id)
      .single()) as unknown as SupabaseResponse;
    userData = {
      loggedIn: true,
      id: user?.id || null,
      email: user?.email || null,
      name: data?.name || null,
      lastname: data?.lastname || null,
      role: data?.role?.role_name || "user",
      church_id: data?.church?.id || null,
    };
    if (error) {
      console.error("Error fetching profile:", error.message);
      return userData;
    }

    let { data: teams, error: teamError } = await supabase
      .from("team-members")
      .select("*")
      .eq("profile", user.id);
    if (error) {
      console.error("Error fetching profile:", error.message);
      return userData;
    }
    const ids = teams.map((team) => team.team_id);
    userData.teams = ids;
  }

  return userData;
}
