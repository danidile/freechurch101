import { createClient } from "@/utils/supabase/server";
import MenuBarComponent from "../../app/components/menuBarComponent";
import { basicUserData } from "@/utils/types/userData";
type ProfileData = {
  name: string;
  lastname: string;
  role?: { role_name: string }; // role is an object, not an array
  church: string | null;
};

type SupabaseResponse = {
  data: ProfileData | null;
  error: Error | null; // Add error here
};
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
    const { data, error } = await supabase
    .from("profiles")
      .select("name, lastname, role:role!inner(role_name), church")
      .eq("id", user.id) // Filter by the user's id
      .single()as unknown as SupabaseResponse; // Use the full SupabaseResponse type

      // Now, TypeScript knows that 'error' exists in the response object
      if (error) {
        console.error("Error fetching profile:", error.message);
      }
      
    userData = {
      loggedIn: true,
      id: user?.id || null,
      email: user?.email || null,
      name: data?.name || "Unknown",
      role: data?.role?.role_name || "user", // No array, safe access
      lastname: data?.lastname || "",
      church_id: data?.church || null,
    };
    console.log("profileData");
    console.log(data);
  } else {
    userData = {
      loggedIn: false,
      role: null,
    };
  }

  return userData;
}
