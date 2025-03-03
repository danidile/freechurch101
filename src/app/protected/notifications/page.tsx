import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import { getNotificationsById } from "@/hooks/GET/getNotificationsById";
import NotificationElement from "./Notification";
import { notificationT } from "@/utils/types/types";

export default async function Page() {
  const userData: basicUserData = await fbasicUserData();
  const notifications: notificationT[] = await getNotificationsById(
    userData.id
  );
  console.log("notifications");
  console.log(notifications);
  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() - 1);
  return (
    <div className="container-sub gap-1">
      <h5 className="text-center m-5 ">Notifiche</h5>
      {notifications &&
        notifications.map((notification: notificationT) => {
          return (
            <NotificationElement
              notification={notification}
              nextDate={nextDate}
            />
          );
        })}
    </div>
  );
}
