import { createClient } from "@/utils/supabase/server";
import Dashboard from "@/app/protected/dashboard/dashboard-components/dashboard";
import { redirect } from "next/navigation";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
import CreateTempProfileForm from "./createTempProfileForm";
export default async function App() {
  const userData: basicUserData = await fbasicUserData();

  if (userData) {
    return (
      <div className="container-sub">
        <h3 className="pb-6">People</h3>
        <CreateTempProfileForm userData={userData} />
      </div>
    );
  } else {
    redirect("/login");
  }
}
