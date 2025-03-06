import { createClient } from "@/utils/supabase/server";
import CompleteAccount from "./CompleteAccount";
import { redirect } from "next/navigation";
import Sidebar from "./sidebar";
import { basicUserData } from "@/utils/types/userData";
import PWADashboard from "../PWADashboard";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { getPendingChurchMembershipRequests } from "@/hooks/GET/getPendingChurchMembershipRequests";
import { Alert, Button } from "@heroui/react";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";

export default async function Dashboard({
  userData,
}: {
  userData: basicUserData;
}) {
  const supabase = createClient();
  const { data: churches } = await supabase
    .from("churches")
    .select("id , church_name");
  const churchList = [];
  if (churches) {
    let church;
    for (let i = 0; i < churches.length; i++) {
      church = {
        id: churches[i].id,
        churchName: churches[i].church_name,
      };
      churchList.unshift(church);
    }
  }
  let pendingRequests = [];

  if (hasPermission(userData.role as Role, "confirm:churchMembership")) {
    pendingRequests = await getPendingChurchMembershipRequests(
      userData.church_id
    );
    console.log("pendingRequests");
    console.log(pendingRequests);
  }

  if (userData) {
    return (
      <div className="flex flex-row w-full gap-12">
        <Sidebar userData={userData} />
        <div className="dashboard-container">
          <h6 className="text-md">
            Benvenuto {userData.name ? userData.name : userData.email}
          </h6>
          {pendingRequests.length > 0 && (
            <div className="flex items-center justify-center w-full">
              <Link prefetch href="/protected/church/confirm-members">
                <Alert
                endContent={<FaExternalLinkAlt />
                }
                  color="warning"
                  description="Alcuni account sono in attesa della tua conferma."
                  title="In attesa di conferma"
                />
              </Link>
            </div>
          )}
          <CompleteAccount churchList={churchList} userData={userData} />
          <PWADashboard userData={userData} />
        </div>
      </div>
    );
  } else {
    redirect("/login");
  }
}
