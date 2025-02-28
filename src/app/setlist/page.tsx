import { basicUserData } from "@/utils/types/userData";
import fbasicUserData from "../../utils/supabase/getUserData";

import Link from "next/link";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { getSetListsByChurch } from "@/hooks/GET/getSetListsByChurch";
import { setListT } from "@/utils/types/types";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";

export default async function Page() {
  const userData: basicUserData = await fbasicUserData();
  const setlists: setListT[] = await getSetListsByChurch(userData.church_id);
  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() - 1);
  const readableCurrentDate = currentDate.toLocaleString("it-IT", {
    weekday: "long", // "Sunday"
    year: "numeric", // "2024"
    month: "long", // "November"
    day: "numeric", // "10"
    // hour: "2-digit", // "10"
    // minute: "2-digit", // "22"
    // second: "2-digit", // "46"
  });
  return (
    <div className="container-sub">
      <h5 className="text-center m-5">Lista eventi</h5>
      {setlists &&
        setlists.map((setlist) => {
          const date = new Date(setlist.date);
          const readableDate = date.toLocaleString("it-IT", {
            weekday: "long", // "Sunday"
            year: "numeric", // "2024"
            month: "long", // "November"
            day: "numeric", // "10"
            // hour: "2-digit", // "10"
            // minute: "2-digit", // "22"
            // second: "2-digit", // "46"
          });
          if (nextDate <= date) {
            return (
              <div className="song-list" key={setlist.id}>
                <Link
                  className="song-list-link"
                  href={`/setlist/${setlist.id}`}
                >
                  <p key={setlist.id}>
                    {setlist.event_title}
                    <br />
                    <small>{readableDate}</small>{" "}
                  </p>
                  <ListAltIcon />
                </Link>
              </div>
            );
          }
        })}
      {hasPermission(userData.role as Role, "create:setlists") && (
        <button className="button-transpose my-10">
          <a href="/setlist/addSetlist">Crea nuova Setlist!</a>
        </button>
      )}
    </div>
  );
}
