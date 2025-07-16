"use client";

import { TeamWithBlockouts } from "@/utils/types/types";
import { calendarMonth } from "@/utils/types/userData";
import { Tabs, Tab, Input, Button, Chip } from "@heroui/react";
import { useEffect, useState } from "react";

export default function BlockoutsCalendarTabs({
  months,
  teams,
}: {
  months: calendarMonth[];
  teams: TeamWithBlockouts[];
}) {
  const [showBlockedOut, setShowBlockedOut] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].team_id);
    }
  }, [teams, selectedTeamId]);

  return (
    <div className="flex w-full flex-col max-w-[1300px] mx-auto pt-3">
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {/* Show Blocked / Available toggle */}
        <label className="cursor-pointer select-none flex items-center gap-2">
          <Button
            onPress={() => setShowBlockedOut(!showBlockedOut)}
            className="cursor-pointer"
          >
            Mostra {showBlockedOut ? "Date Disponibili" : " Date Bloccate"}
          </Button>
        </label>

        {/* Team Buttons */}
        <div className="flex flex-wrap gap-2">
          {teams.map((team) => (
            <Button
              key={team.team_id}
              onPress={() => setSelectedTeamId(team.team_id)}
              className={`${
                selectedTeamId === team.team_id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {team.team_name || team.team_id}
            </Button>
          ))}
        </div>
      </div>
      <Tabs
        aria-label="Options"
        color="primary"
        classNames={{
          tabList:
            "gap-4 w-full relative overflow-x-auto overflow-y-hidden scrollbar-hide",
          tab: "shrink-0 w-[31%] data-[selected=true]:bg-black data-[selected=true]:text-white rounded-lg", // Fixed selected state styling
          base: "w-full overflow-x-auto",
          cursor: "bg-transparent", // Remove default selected indicator
          tabContent: "data-[selected=true]:text-white", // Fixed selected text color
        }}
      >
        {months.map(({ name, year, month, days, emptySpaces }) => (
          <Tab key={name} className="capitalize" title={name}>
            <div key={name}>
              <h2 className="text-xl font-bold mb-2 capitalize">{name}</h2>
              <div className="grid grid-cols-7 ">
                {/* Add empty placeholders to align the first day to Monday */}
                {Array.from({ length: emptySpaces }).map((_, index) => (
                  <div key={`empty-${name}-${index}`} className="calendar-date">
                    <div className="calendar-date-empty"></div>
                  </div>
                ))}
                {/* Render days */}
                {days.map((day) => {
                  const paddedMonth = month.toString().padStart(2, "0");
                  const paddedDay = day.toString().padStart(2, "0");
                  const dateKey = `${year}-${paddedMonth}-${paddedDay}`;

                  const today = new Date();
                  const todayKey = `${today.getFullYear()}-${(
                    today.getMonth() + 1
                  )
                    .toString()
                    .padStart(
                      2,
                      "0"
                    )}-${today.getDate().toString().padStart(2, "0")}`;

                  const isToday = dateKey === todayKey;
                  const selectedTeam = teams.find(
                    (t) => t.team_id === selectedTeamId
                  );
                  const isPast = dateKey < todayKey;

                  return (
                    <div
                      key={dateKey}
                      className={`calendar-date overflow-y-auto ${isToday ? "bg-gray-100!" : ""} ${isPast ? "opacity-65 select-none" : ""}`}
                    >
                      <p
                        className={`calendar-number ${isToday ? "font-bold! text-black!" : ""}`}
                      >
                        {day}
                      </p>
                      <small
                        className={`${showBlockedOut ? "text-red-800" : ""}`}
                      >
                        {selectedTeam
                          ? selectedTeam.teamMembers
                              .filter((member) => {
                                const hasBlockout = member.blockouts.some(
                                  (b) => b.start <= dateKey && b.end >= dateKey
                                );
                                return showBlockedOut
                                  ? hasBlockout
                                  : !hasBlockout;
                              })
                              .map((member, index) => (
                                <span key={member.id}>
                                  {index !== 0 && " - "}
                                  {member.name} {member.lastname}
                                </span>
                              ))
                          : null}
                      </small>
                    </div>
                  );
                })}
              </div>
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
