import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "../../utils/supabase/getUserData";

import Link from "next/link";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { getSetListsByChurch } from "@/hooks/GET/getSetListsByChurch";
import { setListT } from "@/utils/types/types";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { Button } from "@heroui/react";
import { IoEnterOutline } from "react-icons/io5";
import { TransitionLink } from "../components/TransitionLink";
import { IoIosListBox } from "react-icons/io";
import { FaListUl } from "react-icons/fa6";

export default async function Page() {
  const userData: basicUserData = await fbasicUserData();
  const setlists: setListT[] = await getSetListsByChurch(userData.church_id);
  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() - 1);

  return (
    <div className="container-sub">
      <h5 className="text-center m-5">Lista eventi</h5>
      {setlists &&
        setlists.map((setlist) => {
          const date = new Date(setlist.date);
          const dateDay = date.toLocaleString("it-IT", {
            day: "numeric", // "10"
          });
          const dateWeekDay = date.toLocaleString("it-IT", {
            weekday: "short", // "Sunday"
          });
          let isSunday = false;
          if (dateWeekDay == "dom") {
            isSunday = true;
          }
          if (nextDate <= date) {
            return (
              <TransitionLink
                className="setlist-list-link"
                href={`/setlist/${setlist.id}`}
              >
                <div className="setlist-list" key={setlist.id}>
                  <div className="setlist-date-avatar">
                    <p
                      className={`setlist-day ${
                        isSunday ? "text-red-400" : "text-black"
                      }`}
                    >
                      {dateDay}
                    </p>
                    <small className="setlist-weekday">{dateWeekDay}</small>
                  </div>

                  <p className="setlist-name" key={setlist.id}>
                    {setlist.event_title}
                  </p>
                  <FaListUl color="#000000" size={20} />
                </div>
              </TransitionLink>
            );
          }
        })}
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
