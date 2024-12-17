import { createClient } from "@/utils/supabase/server";
import MenuBarComponent from "./menuBarComponent";
import { basicUserData } from "@/utils/types/userData";




export default async function fbasicUserData() {
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
  return userData;
}
