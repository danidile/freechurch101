"use client";

import Link from "next/link";
import { Team } from "@/utils/types/types";
import { getTeamsByChurch } from "@/hooks/GET/getTeamsByChurch";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";

import { PiCirclesThreeBold } from "react-icons/pi";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { FaPlus } from "react-icons/fa";

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
    <div className="container-sub max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h5 className="text-2xl font-semibold text-center">Teams</h5>

      <div className="grid gap-2 my-8">
        {churchTeams?.map((team) => (
          <Link key={team.id} href={`/protected/teams/${team.id}`}>
            <p className="text-lg text-center font-medium text-gray-800">
              {team.team_name}
            </p>
          </Link>
        ))}
      </div>

      {hasPermission(userData.role as Role, "create:team") && (
        <div className="text-center">
          <Link href="/protected/teams/create-team">
            <button
              className="
            inline-flex items-center gap-2 px-4 py-2 bg-black text-white
            rounded-md hover:bg-gray-800 transition-colors duration-150
          "
            >
              <FaPlus /> Crea nuovo team
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
