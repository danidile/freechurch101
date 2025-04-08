import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "../../utils/supabase/getUserData";
import { getSetListsByChurch } from "@/hooks/GET/getSetListsByChurch";
import { setListT } from "@/utils/types/types";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { TransitionLink } from "../components/TransitionLink";
import { FaListUl } from "react-icons/fa6";

export default async function Page() {
  const userData: basicUserData = await fbasicUserData();
  const setlists: setListT[] = await getSetListsByChurch(userData.church_id);
  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() - 1);
  let month = "start";
  return (
    <div className="container-sub">
      <h5 className="text-center m-5">Lista eventi</h5>
      {setlists &&
        setlists.map((setlist, index) => {
          const date = new Date(setlist.date);
          const dateDay = date.toLocaleString("it-IT", {
            day: "numeric", // "10"
          });
          const dateWeekDay = date.toLocaleString("it-IT", {
            weekday: "short", // "Sunday"
          });
          const setlistmonth = date.toLocaleString("it-IT", {
            month: "long",
          });
          let isSunday = false;
          if (dateWeekDay == "dom") {
            isSunday = true;
          }
          let newMonth = false;
          if (setlistmonth !== month) {
            month = setlistmonth;
            newMonth = true;
          }
          if (nextDate <= date) {
            return (
              <>
                {(newMonth || index === 1) && (<h6 className="capitalize">{setlistmonth}</h6>)}
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
              </>
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
