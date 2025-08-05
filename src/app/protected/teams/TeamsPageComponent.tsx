"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PiCirclesThreeBold } from "react-icons/pi";
import { FaPlus } from "react-icons/fa";

import { Team } from "@/utils/types/types";
import { getTeamsByChurch } from "@/hooks/GET/getTeamsByChurch";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@heroui/button";
import { MdOpenInNew } from "react-icons/md";

export default function TeamsPageComponent() {
  const { userData, loading } = useUserStore();
  const [churchTeams, setChurchTeam] = useState<Team[]>([]);

  useEffect(() => {
    if (!loading && userData.loggedIn) {
      getTeamsByChurch(userData.church_id).then((fetchedChurchTeams) => {
        setChurchTeam(fetchedChurchTeams);
      });
    }
  }, [loading, userData]);
  console.log("churchTeams", churchTeams);
  return (
    <div className="max-w-4xl mx-auto px-2 py-8">
      <div className="flex flex-wrap items-center gap-4 justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">Team</h1>

        {hasPermission(userData.role as Role, "create:team") && (
          <Link href="/protected/teams/create-team">
            <Button size="sm" className="gap-2">
              <FaPlus />
              Crea nuovo team
            </Button>
          </Link>
        )}
      </div>

      {churchTeams.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-4 mb-6">
          <p className="text-gray-700">Nessun team trovato.</p>
        </div>
      ) : (
        <div className="grid gap-2 max-w-[850px]">
          {churchTeams.map((team) => (
            <div key={team.id}>
              <Link
                href={`/protected/teams/${team.id}`}
                className="py-2 px-3 rounded  hover:bg-gray-50 transition duration-150 items-center flex justify-between"
              >
                <div className="pr-2">
                  <h4 className=" font-semibold">
                    {team.team_name}{" "}
                    {team.is_worship && (
                      <span className="text-sm font-medium text-gray-800">
                        (Worship Team)
                      </span>
                    )}
                  </h4>

                  <p className="text-sm">
                    <b>Leader:</b> {team.leaders.join(", ")}
                  </p>
                  <p className="text-sm line-clamp-2 ">
                    <b>Membri del team: </b>
                    {team.teamMembers.map((member, index) => {
                      return (
                        <span key={index}>
                          {member.name + " " + member.lastname + ", "}
                        </span>
                      );
                    })}
                  </p>
                </div>
                <MdOpenInNew size={24} />
              </Link>
              <div className="border-b-1 mt-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
