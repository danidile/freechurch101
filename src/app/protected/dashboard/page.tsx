import Dashboard from "@/app/protected/dashboard/dashboard-components/dashboard";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
export default async function App() {
  const userData: basicUserData = await fbasicUserData();
  return (
    <>
      <Dashboard userData={userData} />
    </>
  );
}
