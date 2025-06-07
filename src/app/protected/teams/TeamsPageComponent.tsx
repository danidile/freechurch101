"use client";

import Link from "next/link";
import { Team } from "@/utils/types/types";
import { getTeamsByChurch } from "@/hooks/GET/getTeamsByChurch";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";

import { PiCirclesThreeBold } from "react-icons/pi";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";

export default function TeamsPageComponent() {
  const { userData, fetchUser, loading } = useUserStore();
  const [churchTeams, setChurchTeam] = useState<Team[]>([]);
  // Step 2: Once user is available, fetch songs
  useEffect(() => {
    if (!loading && userData.loggedIn) {
      getTeamsByChurch(userData.church_id).then((fetchedChurchTeams) => {
        setChurchTeam(fetchedChurchTeams);
      });
    }
  }, [loading, userData]);

  return (
    <div className="container-sub">
      <h5 className="text-center m-5">Teams</h5>
      {churchTeams &&
        churchTeams.map((team) => {
          return (
            <Link
              key={team.id}
              className="team-list"
              href={`/protected/teams/${team.id}`}
            >
              <div className="setlist-date-avatar">
                <p
                  className={`setlist-day 
                  }`}
                >
                  <PiCirclesThreeBold />
                </p>
              </div>
              <div className="setlist-list" key={team.id}>
                <p>
                  <b>{team.team_name}</b>
                </p>
              </div>
            </Link>
          );
        })}
      {hasPermission(userData.role as Role, "create:team") && (
        <Button className="button-transpose my-10">
          <Link href="/protected/teams/create-team">Crea nuovo team</Link>
        </Button>
      )}
    </div>
  );
}
