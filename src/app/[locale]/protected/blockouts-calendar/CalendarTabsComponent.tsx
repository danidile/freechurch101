"use client";

import { HeaderCL } from "@/app/[locale]/components/header-comp";
import { TeamWithBlockouts } from "@/utils/types/types";
import { Button } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { LuCalendarClock } from "react-icons/lu";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

const WEEKDAYS = ["lun", "mar", "mer", "gio", "ven", "sab", "dom"];

export default function BlockoutsCalendarTabs({
  teams,
}: {
  teams: TeamWithBlockouts[];
}) {
  const [showBlockedOut, setShowBlockedOut] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [cursor, setCursor] = useState<Date>(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });

  useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].team_id);
    }
  }, [teams, selectedTeamId]);

  const selectedTeam = teams.find((t) => t.team_id === selectedTeamId);

  const { year, monthNum, monthName, days, emptySpaces } = useMemo(() => {
    const year = cursor.getFullYear();
    const monthIndex = cursor.getMonth();
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, monthIndex, 1).getDay();
    const emptySpaces = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    const days = Array.from({ length: totalDays }, (_, j) => j + 1);
    const monthName = cursor.toLocaleString("default", { month: "long" });
    return { year, monthNum: monthIndex + 1, monthName, days, emptySpaces };
  }, [cursor]);

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const goMonth = (delta: number) =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));
  const goToday = () =>
    setCursor(new Date(today.getFullYear(), today.getMonth(), 1));

  const membersForDay = (dateKey: string) => {
    if (!selectedTeam) return [];
    return (selectedTeam.teamMembers || []).filter((member) => {
      const hasBlockout = member.blockouts?.some(
        (b) => b.start <= dateKey && b.end >= dateKey,
      );
      return showBlockedOut ? hasBlockout : !hasBlockout;
    });
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto px-2 sm:px-4 py-3">
      <HeaderCL icon={LuCalendarClock} title="Calendario Presenze" />

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-1">
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            aria-label="Mese precedente"
            onPress={() => goMonth(-1)}
          >
            <ChevronLeft size={18} />
          </Button>
          <h2 className="text-lg sm:text-xl font-semibold text-default-900 capitalize min-w-[150px] text-center">
            {monthName}{" "}
            <span className="font-normal text-default-500">{year}</span>
          </h2>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            aria-label="Mese successivo"
            onPress={() => goMonth(1)}
          >
            <ChevronRight size={18} />
          </Button>
          <Button size="sm" variant="flat" className="ml-1" onPress={goToday}>
            Oggi
          </Button>
        </div>

        {/* Blocked / Available toggle */}
        <div className="inline-flex rounded-lg border border-divider p-0.5 bg-default-50">
          <button
            onClick={() => setShowBlockedOut(true)}
            className={clsx(
              "px-3 py-1 text-sm rounded-md transition-colors",
              showBlockedOut
                ? "bg-danger text-white"
                : "text-default-500 hover:text-default-700",
            )}
          >
            Bloccati
          </button>
          <button
            onClick={() => setShowBlockedOut(false)}
            className={clsx(
              "px-3 py-1 text-sm rounded-md transition-colors",
              !showBlockedOut
                ? "bg-success text-white"
                : "text-default-500 hover:text-default-700",
            )}
          >
            Disponibili
          </button>
        </div>
      </div>

      {/* Team selector */}
      {teams.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {teams.map((team) => (
            <Button
              key={team.team_id}
              size="sm"
              variant={selectedTeamId === team.team_id ? "solid" : "flat"}
              color={selectedTeamId === team.team_id ? "primary" : "default"}
              onPress={() => setSelectedTeamId(team.team_id)}
            >
              {team.team_name || team.team_id}
            </Button>
          ))}
        </div>
      )}

      {/* Calendar */}
      <div className="rounded-xl border border-divider overflow-hidden bg-content1">
        <div className="grid grid-cols-7 text-center text-xs font-medium text-default-400 capitalize border-b border-divider">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-divider">
          {Array.from({ length: emptySpaces }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-content1 min-h-[96px]" />
          ))}
          {days.map((day) => {
            const dateKey = `${year}-${String(monthNum).padStart(
              2,
              "0",
            )}-${String(day).padStart(2, "0")}`;
            const isToday = dateKey === todayKey;
            const isPast = dateKey < todayKey;
            const members = membersForDay(dateKey);

            return (
              <div
                key={dateKey}
                className={clsx(
                  "min-h-[96px] p-1.5 bg-content1 align-top overflow-hidden",
                  isPast && "opacity-60",
                )}
              >
                <div className="flex justify-end">
                  <span
                    className={clsx(
                      "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                      isToday ? "bg-primary text-white" : "text-default-600",
                    )}
                  >
                    {day}
                  </span>
                </div>
                <div className="mt-0.5 flex flex-col gap-0.5 overflow-hidden">
                  {members.slice(0, 4).map((m) => (
                    <span
                      key={m.id}
                      title={`${m.name} ${m.lastname}`}
                      className={clsx(
                        "text-[10px] leading-tight px-1 py-0.5 rounded truncate",
                        showBlockedOut
                          ? "bg-danger/10 text-danger"
                          : "bg-success/10 text-success",
                      )}
                    >
                      {m.name} {m.lastname}
                    </span>
                  ))}
                  {members.length > 4 && (
                    <span className="text-[10px] text-default-400 px-1">
                      +{members.length - 4} altri
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!selectedTeam && (
        <p className="text-sm text-default-400 text-center py-6">
          Nessun team da mostrare.
        </p>
      )}
    </div>
  );
}
