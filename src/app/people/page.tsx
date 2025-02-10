import { redirect } from "next/navigation";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import { profileT } from "@/utils/types/types";
import { getProfilesById } from "@/hooks/GET/getProfilesById";
import PeopleDrawerList from "./peopleDrawerList";

export default async function App() {
  const userData: basicUserData = await fbasicUserData();
  const profiles: profileT[] = await getProfilesById(userData.church_id);

  if (userData) {
    return (
      <div className="container-sub ">
        <h3 className="pb-6">People</h3>
        <div className="flex-col gap-3">
          { profiles && profiles.map((profile: profileT) => {
            return <PeopleDrawerList profile={profile} key={profile.id} />;
          })}
        </div>
      </div>
    );
  } else {
    redirect("/login");
  }
}
