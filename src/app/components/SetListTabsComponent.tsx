"use client";
import { useChurchStore } from "@/store/useChurchStore";
import { TransitionLink } from "./TransitionLink";
import { setListT } from "@/utils/types/types";
import { basicUserData } from "@/utils/types/userData";

export default function SetListTabs({
  setlists,
  userData,
  viewMode,
}: {
  setlists: setListT[];
  userData: basicUserData;
  viewMode?: string;
}) {
  const { eventTypes } = useChurchStore();
  console.log(eventTypes);
  const currentDate = new Date();
  let nextDate = new Date(currentDate);
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

          const isFutureOrToday =
            date >= new Date(new Date().setHours(0, 0, 0, 0));

          if (isFutureOrToday || viewMode === "calendar") {
            let newMonth = false;
            if (setlistmonth !== month) {
              month = setlistmonth;
              newMonth = true;
            }
            const matched = eventTypes?.find(
              (event) => event.key === setlist.event_type
            );
            return (
              <div key={index}>
                {newMonth && (
                  <div className=" mt-3">
                    <h6 className="capitalize font-semibold! ml-0">
                      {setlistmonth}
                    </h6>
                  </div>
                )}
                <TransitionLink
                  className="setlist-list-link    max-w-full!"
                  href={`/setlist/${setlist.id}`}
                >
                  <div className="setlist-list" key={setlist.id}>
                    <div
                      style={{
                        left: "0px",
                        height: "77%",
                        width: "2px",
                        backgroundColor: matched.color,
                        position: "absolute",
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
                      <p>
                        {setlist?.hour && (
                          <strong>
                            {new Date(
                              `1970-01-01T${setlist.hour}`
                            ).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: false, // or false for 24h format
                            })}{" "}
                          </strong>
                        )}
                        {matched?.alt || matched?.label || "Evento sconosciuto"}
                      </p>
                      <div className="flex gap-1 flex-wrap leading-3 text-slate-600">
                        {Object.values(setlist.setlistTeams).flat().length >=
                          1 && <small className="font-semibold">Team: </small>}
                        {Object.values(setlist.setlistTeams)
                          .flat()
                          .map((team, index) => {
                            return (
                              <small
                                key={index}
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
              </div>
            );
          }
        })}
    </div>
  );
}
