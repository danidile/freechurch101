import { redirect } from "next/navigation";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import { pendingRequestsT, profileT } from "@/utils/types/types";
import { getProfilesByChurch } from "@/hooks/GET/getProfilesByChurch";
import PeopleToConfirm from "./peopleDrawerList";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { getPendingChurchMembershipRequests } from "@/hooks/GET/getPendingChurchMembershipRequests";
import { getTempProfilesByChurch } from "@/hooks/GET/getTempProfilesByChurch";

export default async function App() {
  const userData: basicUserData = await fbasicUserData();
  const profiles: profileT[] = await getProfilesByChurch(userData.church_id);
  let pendingRequests: pendingRequestsT[] = [] as pendingRequestsT[];
  const tempProfiles: profileT[] = await getTempProfilesByChurch(
    userData.church_id
  );

  if (hasPermission(userData.role as Role, "confirm:churchMembership")) {
    pendingRequests = await getPendingChurchMembershipRequests(
      userData.church_id
    );
    console.log("pendingRequests");
    console.log(pendingRequests);
  }
  if (userData) {
    return (
      <div className="container-sub ">
        <h3>Conferma </h3>
        <small className="max-w-96 mb-10 text-slate-400">
          Le persone elencate in questa lista vogliono diventare parte della tua
          chiesa. Confermi che ne fanno parte?
        </small>
        <div className="flex-col gap-3">
          {pendingRequests &&
            pendingRequests.map((profile: profileT) => {
              return (
                <PeopleToConfirm
                  tempProfiles={tempProfiles}
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
