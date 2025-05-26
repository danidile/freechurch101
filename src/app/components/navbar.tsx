import MenuBarComponent from "./menuBarComponent";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "../../utils/supabase/getUserData";

import { getPendingNotificationsById } from "@/hooks/GET/getPendingNotificationsById";

export default async function MenuBar() {
  const userData: basicUserData | null = await fbasicUserData();
  console.log(userData);
  const notifications: number = await getPendingNotificationsById(userData.id);
  return <MenuBarComponent notifications={notifications} userData={userData} />;
}
