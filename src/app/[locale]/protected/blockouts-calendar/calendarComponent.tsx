"use client";
import { getSetListsByChurch } from "@/hooks/GET/getSetListsByChurch";
import { setListT, TeamWithBlockouts } from "@/utils/types/types";
import { calendarMonth, profilesTeams } from "@/utils/types/userData";
import { useUserStore } from "@/store/useUserStore";
import { useState, useEffect } from "react";
import BlockoutsCalendarTabs from "./CalendarTabsComponent";
import { getBlockoutsByTeamId } from "@/hooks/GET/getBlockoutsByTeam";

export default function BlockoutsCalendarComponent() {
  const { userData, loading } = useUserStore();
  const [setlists, setSetlists] = useState<any[] | null>(null);
  const [teams, setTeams] = useState<TeamWithBlockouts[]>([]); // ← array of teams
  useEffect(() => {
    const fetchData = async () => {
      if (!loading && userData.loggedIn) {
        const teamsArray = [];
        for (const team of userData.teams.filter(
          (team: profilesTeams) => team.role === "leader"
        )) {
          const teamMembers: TeamWithBlockouts = await getBlockoutsByTeamId(
            team.team_id
          );
          if (teamMembers) {
            teamsArray.push(teamMembers);
          }
        }
        setTeams(teamsArray); // ← push to state
        const fetchedSetlists = await getSetListsByChurch(userData.church_id);
        setSetlists(fetchedSetlists);
      }
    };
    fetchData();
  }, [loading, userData]);

  const today = new Date();
  const months: calendarMonth[] = [];

  // Loop for the next 3 months
  for (let i = 0; i < 3; i++) {
    const currentMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const monthName = currentMonth.toLocaleString("default", { month: "long" });
    const year = currentMonth.getFullYear();
    const monthNum = currentMonth.getMonth() + 1; // numero da 1 a 12
    const month = monthNum; // mantiene tipo number

    const totalDays = new Date(year, monthNum, 0).getDate();
    const firstDayOfWeek = new Date(year, monthNum - 1, 1).getDay();

    const emptySpaces = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days = Array.from({ length: totalDays }, (_, j) => j + 1);

    months.push({ name: monthName, year, month, days, emptySpaces });
  }
  console.log("teams", teams);
  return <BlockoutsCalendarTabs months={months} teams={teams} />;
}
