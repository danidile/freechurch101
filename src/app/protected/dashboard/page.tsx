// app/protected/dashboard/page.tsx
import { redirect } from "next/navigation";
import DashboardWrapper from "./dashboard-wrapper";
import fbasicUserData from "@/utils/supabase/getUserData";
import { getAllChurches } from "@/hooks/GET/getAllChurches";

export default async function App() {
  const userData = await fbasicUserData();
  if (!userData) redirect("/login");

  return <DashboardWrapper  userData={userData} />;
}
