"use server";
import { createClient } from "@/utils/supabase/server";
import { profileT } from "@/utils/types/types";
import { basicUserData } from "@/utils/types/userData";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
type ProfileData = {
  name: string;
  lastname: string;
  role?: { role_name: string }; // role is an object, not an array
  church: {
    id: string | null;
    church_name: string | null;
  };
};

type SupabaseResponse = {
  data: ProfileData | null;
  error: Error | null; // Add error here
};
export const updateProfileRole = async (profile: profileT, newRole: string) => {
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
    return;
  }

  if (user) {
    const { data, error } = (await supabase
      .from("profiles")
      .select("name, lastname, role(role_name), church(id,church_name)")
      .eq("id", user.id) // Filter by the user's id
      .single()) as unknown as SupabaseResponse; // Use the full SupabaseResponse type
    userData = {
      loggedIn: true,
      id: user?.id || null,
      email: user?.email || null,
      name: data?.name || null,
      role: data?.role?.role_name || "user", // No array, safe access
      lastname: data?.lastname || null,
      church_id: data?.church?.id || null,
      church_name: data?.church?.church_name || null,
    };

    if (
      userData.church_id === profile.church &&
      hasPermission(userData.role as Role, "update:role")
    ) {
      console.log("Churches match and User is authorized");
      if (userData) {
        const { error } = await supabase
          .from("profiles")
          .update({ role: newRole })
          .eq("id", profile.id)
          .select();
        if (error) {
          console.log("Role Update not successfull", error);
        } else {
          console.log("Role Update successfully");
        }
      }
    } else {
      console.log("Churches DO NOT match OR User is authorized");
    }
  }
};
