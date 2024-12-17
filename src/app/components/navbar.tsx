import { createClient } from "@/utils/supabase/server";
import Dashboard from "@/app/protected/dashboard/dashboard-components/dashboard";
import { redirect } from "next/navigation";
import MenuBarComponent from "./menuBarComponent";
import { basicUserData } from "@/utils/types/userData";

export default async function MenuBar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  
  let userData: basicUserData = {
    loggedIn: true,
  };

  if (user) {
    userData = {
      loggedIn: true,
      id: user.id,
      email: user.email,
      name: "Daniele",
    };
  } else {
    userData = {
      loggedIn: false,
    };
  }

  console.log(userData);
  return <MenuBarComponent userData={userData} />;
}
