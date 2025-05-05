"use client";
import { TransitionLink } from "./TransitionLink";
import { Tabs, Tab } from "@heroui/tabs";
import { FaListUl } from "react-icons/fa";
import { setListT } from "@/utils/types/types";
import { basicUserData } from "@/utils/types/userData";
import { Chip } from "@heroui/react";

export const animals = [
  { key: "cat", label: "Cat" },
  { key: "dog", label: "Dog" },
  { key: "elephant", label: "Elephant" },
  { key: "lion", label: "Lion" },
  { key: "tiger", label: "Tiger" },
  { key: "giraffe", label: "Giraffe" },
  { key: "dolphin", label: "Dolphin" },
  { key: "penguin", label: "Penguin" },
  { key: "zebra", label: "Zebra" },
  { key: "shark", label: "Shark" },
  { key: "whale", label: "Whale" },
  { key: "otter", label: "Otter" },
  { key: "crocodile", label: "Crocodile" },
];

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
                  <div className="setlist-list-link mt-6">
                    <h6 className="capitalize ml-0">{setlistmonth}</h6>
                  </div>
                )}
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

                    <div className="setlist-name-exp" key={setlist.id}>
                      <p>{setlist.event_title}</p>
                      <div className="flex gap-1 flex-wrap leading-3 text-slate-600">
                        {Object.values(setlist.setlistTeams).flat().length >=
                          1 && <small className="font-semibold">Team: </small>}
                        {Object.values(setlist.setlistTeams)
                          .flat()
                          .map((team) => {
                            if (team.name === "Daniele") {
                              console.log(userData.id);
                              console.log(team.profile);
                            }

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
