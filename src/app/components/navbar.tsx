
import MenuBarComponent from "./menuBarComponent";
import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "./getUserData";

export default async function MenuBar() {

  const userData:basicUserData = await fbasicUserData();

  console.log(userData);
  return <MenuBarComponent userData={userData} />;
}
