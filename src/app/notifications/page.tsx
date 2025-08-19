import { LuInbox } from "react-icons/lu";
import { HeaderCL } from "../components/header-comp";
import NotificationList from "./NotificationList";

export default async function NotificationPage() {
  return (
    <div className="container-sub">
      <HeaderCL
        icon={LuInbox}
        title="Notifiche"
        description="Tutti gli aggiornamenti e gli avvisi che riguardano la tua attività."
      />

      <NotificationList />
    </div>
  );
}
