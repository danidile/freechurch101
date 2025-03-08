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
    const { data, error } = (await supabase
      .from("profiles")
      .select("name, lastname, role:role!inner(role_name), church")
      .eq("id", user.id) // Filter by the user's id
      .single()) as unknown as SupabaseResponse; // Use the full SupabaseResponse type

    // Now, TypeScript knows that 'error' exists in the response object
    if (error) {
      console.error("Error fetching profile:", error.message);
    }
    let churchpending:boolean = false;
    if (!data.church) {
      let { data: churchMembershipRequest } = await supabase
        .from("church-membership-request")
        .select("*")
        .eq("profile", user.id);
        console.log("churchMembershipRequest");
        console.log(churchMembershipRequest);
        if(churchMembershipRequest.length>0) churchpending = true;
      }
    userData = {
      loggedIn: true,
      id: user?.id || null,
      email: user?.email || null,
      name: data?.name || null,
      role: data?.role?.role_name || "user", // No array, safe access
      lastname: data?.lastname || null,
      church_id: data?.church || null,
      pending_church_confirmation: churchpending ,
    };
    console.log("userData");
    console.log(userData);
  } else {
    userData = {
      loggedIn: false,
      role: null,
    };
  }

  return userData;
}
