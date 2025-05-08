import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "../../utils/supabase/getUserData";
import { getSetListsByChurch } from "@/hooks/GET/getSetListsByChurch";
import { setListT } from "@/utils/types/types";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { TransitionLink } from "../components/TransitionLink";
import SetListTabs from "../components/SetListTabsComponent";
import NewEventButtonComponent from "./dropdownNewEventButtonComponent";

export default async function Page() {
  const userData: basicUserData = await fbasicUserData();
  const setlists: setListT[] = await getSetListsByChurch(userData.church_id);

  return (
    <div className="container-sub !max-w-96">
      <h5 className="text-center m-5">Prossimi eventi</h5>
      <div className="w-full flex justify-end">
        {hasPermission(userData.role as Role, "create:setlists") && (
          <>
            <TransitionLink
              href="/setlist/addSetlist"
              className="button-style"
              prefetch
            >
              Nuovo Evento
            </TransitionLink>

          </>
        )}
      </div>

      <SetListTabs userData={userData} setlists={setlists} />
    </div>
  );
}
