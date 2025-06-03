import { createClient } from "@/utils/supabase/server";
import Dashboard from "@/app/protected/dashboard/dashboard-components/dashboard";
import { redirect } from "next/navigation";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import CompleteAccount from "./CompleteAccount";
export default async function App() {
  const userData: basicUserData = await fbasicUserData();
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
  if (userData) {
    return (
      <div className="container-sub">
        <CompleteAccount churchList={churchList} userData={userData} />
      </div>
    );
  } else {
    redirect("/login");
  }
}
