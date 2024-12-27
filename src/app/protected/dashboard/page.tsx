import { createClient } from "@/utils/supabase/server";
import Dashboard from "@/app/protected/dashboard/dashboard-components/dashboard";
import { redirect } from "next/navigation";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";

export default async function App() {
  const userData: basicUserData = await fbasicUserData();


  if (userData) {
    return (
      <>
        <Dashboard userData={userData} />
      </>
    );
  } else {
    redirect("/login");
  }
}
