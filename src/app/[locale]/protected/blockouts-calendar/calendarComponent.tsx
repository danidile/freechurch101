"use client";
import { TeamWithBlockouts } from "@/utils/types/types";
import { profilesTeams } from "@/utils/types/userData";
import { useUserStore } from "@/store/useUserStore";
import { useState, useEffect } from "react";
import BlockoutsCalendarTabs from "./CalendarTabsComponent";
import { getBlockoutsByTeamId } from "@/hooks/GET/getBlockoutsByTeam";

export default function BlockoutsCalendarComponent() {
  const { userData, loading } = useUserStore();
  const [teams, setTeams] = useState<TeamWithBlockouts[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!loading && userData?.loggedIn) {
        const teamsArray: TeamWithBlockouts[] = [];
        for (const team of (userData.teams || []).filter(
          (t: profilesTeams) => t.role === "leader",
        )) {
          const teamMembers: TeamWithBlockouts = await getBlockoutsByTeamId(
            team.team_id,
          );
          if (teamMembers) {
            teamsArray.push(teamMembers);
          }
        }
        setTeams(teamsArray);
      }
    };
    fetchData();
  }, [loading, userData]);

  return <BlockoutsCalendarTabs teams={teams} />;
}
