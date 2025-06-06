import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "@/utils/supabase/getUserData";
import { getNotificationsById } from "@/hooks/GET/getNotificationsById";
import { GroupedNotificationsT } from "@/utils/types/types";
import NotificationList from "./NotificationList";

export default async function NotificationPage() {


  return (
    <div className="container-sub gap-1 ">
      <h5 className="text-center m-5 ">Notifiche</h5>
      <NotificationList/>
    </div>
  );
}
