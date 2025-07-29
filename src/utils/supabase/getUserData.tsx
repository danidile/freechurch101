import { createClient } from "@/utils/supabase/client";
import { basicUserData } from "@/utils/types/userData";

type ProfileData = {
  name: string;
  lastname: string;
  phone?: string;
  role?: { role_name: string }; // role is an object, not an array
  church: {
    logo: string | null;
    id: string | null;
    church_name: string | null;
  };
  avatar_url: string;
};

type SupabaseResponse = {
  data: ProfileData | null;
  error: Error | null; // Add error here
};

export default async function fbasicUserData() {
  let userData: basicUserData = {
    loggedIn: false,
    role: "user",
    fetched: true,
  };
  console.time("⏱️ Fetched user data");

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  console.timeEnd("⏱️ Fetched user data");

  if (userError) {
    console.log("Not logged in:", userError.message);
    return userData;
  }

  if (user) {
    const { data, error } = (await supabase
      .from("profiles")
      .select(
        "name, lastname,avatar_url, role(role_name), church(id,church_name,logo),phone"
      )
      .eq("id", user.id) // Filter by the user's id
      .single()) as unknown as SupabaseResponse; // Use the full SupabaseResponse type
    userData = {
      loggedIn: true,
      id: user?.id || null,
      email: user?.email || null,
      phone: data?.phone || null,
      name: data?.name || null,
      role: data?.role?.role_name || "user", // No array, safe access
      lastname: data?.lastname || null,
      church_id: data?.church?.id || null,
      church_name: data?.church?.church_name || null,
      church_logo: data?.church?.logo || null,
      avatar_url: data?.avatar_url || null,
    };
    // Now, TypeScript knows that 'error' exists in the response object
    if (error) {
      console.log("Error fetching profile:", error.message);
      return userData;
    }

    let { data: teams, error: teamError } = await supabase
      .from("team-members")
      .select("team_id,role")
      .eq("profile", user.id);
    if (error) {
      console.log("Error fetching profile:", error.message);
      return userData;
    }
    const teamsFormatted = teams
      .filter((team) => team.role === "leader")
      .map((team) => {
        return { team_id: team.team_id, role: "leader" };
      });
    userData.teams = teamsFormatted;
  }

  return userData;
}
