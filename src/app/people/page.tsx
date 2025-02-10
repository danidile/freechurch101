import { redirect } from "next/navigation";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import { profileT, Team } from "@/utils/types/types";
import { getProfilesById } from "@/hooks/GET/getProfilesById";
import PeopleDrawerList from "./peopleDrawerList";

export default async function App() {
  const userData: basicUserData = await fbasicUserData();
  const profiles: profileT[] = await getProfilesById(userData.church_id);

  console.log("profiles");
  console.log(profiles);

  if (userData) {
    return (
      <div className="container-sub ">
        <h3 className="pb-6">People</h3>
        <div>
         {profiles.map((profile: profileT) => {
            return (
              <PeopleDrawerList profile={profile}/>
            );
          })}
          </div>
      </div>
    );
  } else {
    redirect("/login");
  }
}
