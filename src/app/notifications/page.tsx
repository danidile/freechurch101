import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import { getNotificationsById } from "@/hooks/GET/getNotificationsById";
import { GroupedNotificationsT } from "@/utils/types/types";
import NotificationList from "./NotificationList";

export default async function Page() {
  const userData: basicUserData = await fbasicUserData();
  const notifications: GroupedNotificationsT = await getNotificationsById(
    userData.id
  );

  console.log("notifications");
  console.log(notifications);

  return (
    <div className="container-sub gap-1 ">
      <h5 className="text-center m-5 ">Notifiche</h5>
      <NotificationList notifications={notifications} />
    </div>
  );
}
