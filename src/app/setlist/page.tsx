import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "../../utils/supabase/getUserData";
import { getSetListsByChurch } from "@/hooks/GET/getSetListsByChurch";
import { setListT } from "@/utils/types/types";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { TransitionLink } from "../components/TransitionLink";
import { FaListUl } from "react-icons/fa6";
import SetlistViewMode from "../components/SetListTabsComponent";
import { Tab, Tabs } from "@heroui/tabs";
import SetListTabs from "../components/SetListTabsComponent";

export default async function Page() {
  const userData: basicUserData = await fbasicUserData();
  const setlists: setListT[] = await getSetListsByChurch(userData.church_id);
  
  return (
    <div className="container-sub">
      <h5 className="text-center m-5">Lista eventi</h5>
      <SetListTabs userData={userData} setlists={setlists} />

      {hasPermission(userData.role as Role, "create:setlists") && (
        <TransitionLink
          href="/setlist/addSetlist"
          className="button-style my-10"
          prefetch
        >
          Crea nuova Setlist!
        </TransitionLink>
      )}
    </div>
  );
}
