import LoginForm from "./loginForm";
import { TalertMessage } from "@/utils/types/types";
import { redirect } from "next/navigation";
import fbasicUserData from "@/utils/supabase/getUserData";
import { basicUserData } from "@/utils/types/userData";

export default async function Login({
  searchParams,
}: {
  searchParams: TalertMessage;
}) {
  const userData: basicUserData = await fbasicUserData();
  if (userData.loggedIn) {
    redirect("/protected/dashboard");
  }
  return (
    <div className="container-sub">
      <LoginForm />
    </div>
  );
}
