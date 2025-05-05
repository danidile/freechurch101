import { redirect } from "next/navigation";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import { profileT } from "@/utils/types/types";
import { getProfilesByChurch } from "@/hooks/GET/getProfilesByChurch";
import PeopleDrawerList from "./peopleDrawerList";
import GetParamsMessage from "../components/getParams";
import Link from "next/link";
import { TiUser } from "react-icons/ti";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default async function App() {
  const userData: basicUserData = await fbasicUserData();
  const profiles: profileT[] = await getProfilesByChurch(userData.church_id);

  if (userData) {
    return (
      <div className="container-sub ">
        <h3 className="pb-6">People</h3>
        {/* <Link prefetch href="/people/add-temp-user">Aggiungi utenti temporanei</Link> */}
        <div className="flex-col gap-3">
          <GetParamsMessage />
          {profiles &&
            profiles.map((profile: profileT) => {
              return (
                <div className="flex flex-row w-full gap-12" key={profile.id}>
                  <Link
                    className="people-link"
                    href={`/people/${profile.id}`}
                    key={profile.id}
                  >
                    <div className="people-list" key={profile.id}>
                      <div className="flex flex-row gap-2 items-center">
                        <TiUser color={profile.isTemp ? "#f5a524" : "black"} />
                        <p key={profile.id}>
                          {profile.name} {profile.lastname}
                        </p>
                      </div>

                      <span className="material-symbols-outlined">
                        <MoreVertIcon className="text-default-400" />
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    );
  } else {
    redirect("/login");
  }
}
