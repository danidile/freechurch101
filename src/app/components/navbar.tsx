import MenuBarComponent from "./menuBarComponent";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "../../utils/supabase/getUserData";

export default async function MenuBar() {
  const userData: basicUserData = await fbasicUserData();
  return <MenuBarComponent userData={userData} />;
}
