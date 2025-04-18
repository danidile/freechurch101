import { redirect } from "next/navigation";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import { profileT } from "@/utils/types/types";
import { getProfilesByChurch } from "@/hooks/GET/getProfilesByChurch";
import PeopleDrawerList from "./peopleDrawerList";
import GetParamsMessage from "../components/getParams";
import Link from "next/link";

export default async function App() {
  const userData: basicUserData = await fbasicUserData();
  const profiles: profileT[] = await getProfilesByChurch(userData.church_id);

  if (userData) {
    return (
      <div className="container-sub ">
        <h3 className="pb-6">People</h3>
        <Link prefetch href="/people/add-temp-user">Aggiungi utenti temporanei</Link>
        <div className="flex-col gap-3">
          <GetParamsMessage />
          {profiles &&
            profiles.map((profile: profileT) => {
              return (
                <PeopleDrawerList
                  userData={userData}
                  profile={profile}
                  key={profile.id}
                />
              );
            })}
        </div>
      </div>
    );
  } else {
    redirect("/login");
  }
}
