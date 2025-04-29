import { redirect } from "next/navigation";
import { basicUserData } from "@/utils/types/userData";
import PWADashboard from "../PWADashboard";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { getPendingChurchMembershipRequests } from "@/hooks/GET/getPendingChurchMembershipRequests";
import { pendingRequestsT } from "@/utils/types/types";


export default async function Dashboard({
  userData,
}: {
  userData: basicUserData;
}) {
  let pendingRequests: pendingRequestsT[] = [];

  if (userData && hasPermission(userData.role as Role, "confirm:churchMembership")) {
    pendingRequests = await getPendingChurchMembershipRequests(
      userData.church_id
    );
  }

  if (userData) {
    return (
      <div className="flex flex-row w-full gap-12">
        {/* <Sidebar userData={userData} /> */}
        <div className="container-sub">
          <h6 className="text-md">
            Benvenuto {userData.name ? userData.name : userData.email}
          </h6>
          <PWADashboard pendingRequests={pendingRequests} userData={userData} />
        </div>
      </div>
    );
  } else {
    redirect("/login");
  }
}
