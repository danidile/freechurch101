"use client";
import { TransitionLink } from "./TransitionLink";
import { setListT } from "@/utils/types/types";
import { basicUserData } from "@/utils/types/userData";

export default function SetListTabs({
  setlists,
  userData,
}: {
  setlists: setListT[];
  userData: basicUserData;
}) {
  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() - 1);
  let month = "ve";
  return (
    <div className="setlistviewmode-container">
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

          if (nextDate <= date) {
            let newMonth = false;
            if (setlistmonth !== month) {
              month = setlistmonth;
              newMonth = true;
            }
            return (
              <>
                {newMonth && (
                  <div className="setlist-list-link mt-3">
                    <h6 className="capitalize !font-semibold ml-0">
                      {setlistmonth}
                    </h6>
                  </div>
                )}
                <TransitionLink
                  className="setlist-list-link border-1 rounded-2xl border-slate-300 my-1  !max-w-full"
                  href={`/setlist/${setlist.id}`}
                >
                  <div className="setlist-list" key={setlist.id}>
                    <div
                      style={{
                        left: "0px",
                        height: "100%",
                        width: "5px",
                        backgroundColor:  setlist.color,
                        position: "absolute"
                      }}
                    ></div>

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

                    <div className="setlist-name-exp" key={setlist.id}>
                      <p>{setlist.event_title}</p>
                      <div className="flex gap-1 flex-wrap leading-3 text-slate-600">
                        {Object.values(setlist.setlistTeams).flat().length >=
                          1 && <small className="font-semibold">Team: </small>}
                        {Object.values(setlist.setlistTeams)
                          .flat()
                          .map((team) => {
                            return (
                              <small
                                className={`${
                                  team.profile === userData.id
                                    ? "font-bold"
                                    : ""
                                } ${
                                  team.profile === userData.id
                                    ? "text-cyan-800"
                                    : ""
                                }`}
                              >
                                {team.name + " " + team.lastname}
                              </small>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </TransitionLink>
              </>
            );
          }
        })}
    </div>
  );
}
