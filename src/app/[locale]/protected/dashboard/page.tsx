import Dashboard from "@/app/[locale]/protected/dashboard/dashboard-components/dashboard";
import { redirect } from "next/navigation";
export default function App() {
  redirect("/it/protected/dashboard/account");

  return <Dashboard />;
}
