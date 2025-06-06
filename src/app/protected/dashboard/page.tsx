import Dashboard from "@/app/protected/dashboard/dashboard-components/dashboard";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";
export default async function App() {
  return (
    <>
      <Dashboard  />
    </>
  );
}
