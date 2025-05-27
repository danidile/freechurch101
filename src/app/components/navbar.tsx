import MenuBarComponentSecondary from "./menuBarComponent2";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "../../utils/supabase/getUserData";

import { getPendingNotificationsById } from "@/hooks/GET/getPendingNotificationsById";

export default async function MenuBar() {
  const userData: basicUserData | null = await fbasicUserData();
  const notifications: number = await getPendingNotificationsById(userData.id);
  return (
    <>
      {/* <MenuBarComponent userData={userData} notifications={notifications} /> */}
      <MenuBarComponentSecondary userData={userData} notifications={notifications} />
    </>
  );
}
