import { redirect } from "next/navigation";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import MyChurch from "./mychurchComponent";
import { createClient } from "@/utils/supabase/server";
import { profileT, Team } from "@/utils/types/types";
import { getProfilesById } from "@/hooks/GET/getProfilesById";

export default async function App() {
  const userData: basicUserData = await fbasicUserData();
  const profiles: profileT[] = await getProfilesById(userData.church_id);

  console.log("profiles");
  console.log(profiles);

  if (userData) {
    return (
      <>
        <MyChurch userData={userData} profiles={profiles} />
      </>
    );
  } else {
    redirect("/login");
  }
}
