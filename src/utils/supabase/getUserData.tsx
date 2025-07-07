import { createClient } from "@/utils/supabase/client";
import { basicUserData } from "@/utils/types/userData";
import { sendErrorToSentry } from "../sentry/SentryErrorDealer";

type ProfileData = {
  name: string;
  lastname: string;
  phone: string;
  role?: { role_name: string }; // role is an object, not an array
  church: {
    logo: string | null;
    id: string | null;
    church_name: string | null;
  };
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
      .select(
        "name, lastname, role(role_name), church(id,church_name,logo),phone"
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
    };
    // Now, TypeScript knows that 'error' exists in the response object
    if (error) {
      console.error("Error fetching profile:", error.message);
      sendErrorToSentry(error.message, userData);
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
  }

  return userData;
}
