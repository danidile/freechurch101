import MenuBarComponent from "./menuBarComponent";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "../../utils/supabase/getUserData";
import { notificationT } from "@/utils/types/types";
import { getNotificationsById } from "@/hooks/GET/getNotificationsById";

export default async function MenuBar() {
  const userData: basicUserData = await fbasicUserData();
    const notifications: notificationT[] = await getNotificationsById(
      userData.id);
  return <MenuBarComponent notifications={notifications} userData={userData} />;
}
