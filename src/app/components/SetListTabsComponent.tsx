"use client";
import { useChurchStore } from "@/store/useChurchStore";
import { TransitionLink } from "./TransitionLink";
import { setListT } from "@/utils/types/types";
import { basicUserData } from "@/utils/types/userData";
import { useState } from "react";

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
  const currentDate = new Date();
  let nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() - 1);
  const [selectedEventType, setSelectedEventType] = useState("");

  let month = "ve";
  // This is the updated code block you can use.
  const isFutureOrToday = (date: Date) =>
    date >= new Date(new Date().setHours(0, 0, 0, 0));

  const futureSetlists = setlists
    ? setlists.filter((setlist) => isFutureOrToday(new Date(setlist.date)))
    : [];

  const presentEventTypes =
    futureSetlists.length > 0
      ? [...new Set(futureSetlists.map((setlist) => setlist.event_type))]
      : [];
  return (
    <div className="flex flex-row w-full justify-center">
      <div className="max-w-[250px] w-full min-h-[100px] p-2 border-r select-none hidden sm:block">
        <div
          className="p-2  border-b-1 mb-1 flex items-center gap-2 transition-colors duration-200 ease-in-out"
          key="type"
        >
          <p className="font-medium">Filtra per Tipo evento:</p>
        </div>{" "}
        <div
          className="p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 mb-1 flex items-center gap-2 transition-colors duration-200 ease-in-out"
          key="all"
          onClick={() => setSelectedEventType("")}
        >
          <p>Vedi Tutti</p>
        </div>{" "}
        {eventTypes &&
          eventTypes
            .filter((eventType) => presentEventTypes.includes(eventType.key))
            .map((eventType) => (
              <div
                className="p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 mb-1 flex items-center gap-2 transition-colors duration-200 ease-in-out"
                key={eventType.key}
                onClick={() => setSelectedEventType(eventType.key)}
              >
                <p>{eventType.alt ? eventType.alt : eventType.label}</p>
              </div>
            ))}
      </div>
      <div className="setlistviewmode-container ">
        {setlists &&
          setlists
            .filter((setlist) => {
              // If no event type is selected, or if the setlist's event_type matches the selected one, return true
              return (
                !selectedEventType || setlist.event_type === selectedEventType
              );
            })
            .map((setlist, index) => {
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
                  <div key={index} className="w-full">
                    {newMonth && (
                      <div className=" mt-3">
                        <h6 className="capitalize font-semibold! ml-0">
                          {setlistmonth}
                        </h6>
                      </div>
                    )}
                    <TransitionLink
                      className={`setlist-list-link  max-w-full! ${viewMode === "preview-multiple" ? "pointer-events-none text-gray-400" : ""}`}
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
                          <small className="setlist-weekday">
                            {dateWeekDay}
                          </small>
                        </div>
                        <div className="setlist-name-exp" key={setlist.id}>
                          <p className="w-full max-w-[250px]">
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
                            {matched?.alt ||
                              matched?.label ||
                              "Evento sconosciuto"}
                          </p>
                          <div className="w-full max-w-[350px] min-h-1 flex gap-1 flex-wrap leading-3 text-slate-600">
                            <small className="font-semibold">
                              {setlist.setlistTeams &&
                                Object.values(setlist.setlistTeams).flat()
                                  .length >= 1 && <>Team: </>}
                            </small>
                            {setlist.setlistTeams &&
                              Object.values(setlist.setlistTeams)
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
    </div>
  );
}
