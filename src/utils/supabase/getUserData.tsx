import { createClient } from "@/utils/supabase/server";
import MenuBarComponent from "../../app/components/menuBarComponent";
import { basicUserData } from "@/utils/types/userData";

export default async function fbasicUserData() {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  let userData: basicUserData = {
    loggedIn: true,
  };
  if (userError) {
    console.error("Not logged in:", userError.message);
  } else {
    let userData: basicUserData = {
      loggedIn: false,
    };
  }

  if (user) {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("name,lastname, role,church") // Assuming role_id is a foreign key to the roles table
      .eq("id", user.id) // Filter by the user's id
      .single();
    
    userData = {
      loggedIn: true,
      id: user.id,
      email: user.email,
      name: profileData.name,
      role: profileData.role,
      lastname: profileData.lastname,
      church_id: profileData.church,
    };
  } else {
    userData = {
      loggedIn: false,
      role: "0",
    };
  }

  return userData;
}
