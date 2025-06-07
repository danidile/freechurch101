"use client";
import { getSetListsByChurch } from "@/hooks/GET/getSetListsByChurch";
import { setListT } from "@/utils/types/types";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { TransitionLink } from "../components/TransitionLink";
import SetListTabs from "../components/SetListTabsComponent";
import { FiPlus } from "react-icons/fi";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";

export default function SetListListComponent() {
  const { userData, fetchUser, loading } = useUserStore();
  const [setlists, setSetlists] = useState<any[] | null>(null);

  useEffect(() => {
    if (!loading && userData.loggedIn) {
      getSetListsByChurch(userData.church_id).then(
        (fetchedSetLists: setListT[]) => {
          setSetlists(fetchedSetLists);
        }
      );
    }
  }, [loading, userData]);

  return (
    <div className="container-sub !max-w-96">
      <h5 className="text-center m-2">Prossimi eventi</h5>
      <div className="w-full flex justify-end">
        {hasPermission(userData.role as Role, "create:setlists") && (
          <>
            <TransitionLink
              href="/setlist/addSetlist"
              className="button-style flex items-center gap-2"
            >
              Nuovo Evento
              <FiPlus />
            </TransitionLink>
          </>
        )}
      </div>

      <SetListTabs userData={userData} setlists={setlists} />
    </div>
  );
}
