import MenuBarComponentSecondary from "./menuBarComponent2";
import { getPendingNotificationsById } from "@/hooks/GET/getPendingNotificationsById";

export default async function MenuBar() {
  const notifications: number = await getPendingNotificationsById();
  return <MenuBarComponentSecondary notifications={notifications} />;
}
