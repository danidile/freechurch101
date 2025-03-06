import { createClient } from "@/utils/supabase/server";
import CompleteAccount from "./CompleteAccount";
import { redirect } from "next/navigation";
import Sidebar from "./sidebar";
import { basicUserData } from "@/utils/types/userData";
import PWADashboard from "../PWADashboard";

export default async function Dashboard({
  userData,
}: {
  userData: basicUserData;
}) {
  const supabase = createClient();
  let accountCompleted = false;
  if ((userData.name && userData.lastname) || userData.church_id) {
    accountCompleted = true;
  }

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
  if (userData) {
    return (
      <div className="flex flex-row w-full gap-12">
        <Sidebar userData={userData} />
        <div className="dashboard-container">
          <h6 className="text-md">Benvenuto {userData.email}</h6>
          {!accountCompleted && (
            <CompleteAccount churchList={churchList} userData={userData} />
          )}
            <PWADashboard userData={userData} />
        </div>
      </div>
    );
  } else {
    redirect("/login");
  }
}
