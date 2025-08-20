"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaAsterisk, FaPlus } from "react-icons/fa";
import { MdOpenInNew, MdOutlineLibraryMusic } from "react-icons/md";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@heroui/button";
import { getTeamsByChurch } from "@/hooks/GET/getTeamsByChurch";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { Team } from "@/utils/types/types";
import { HeaderCL } from "@/app/components/header-comp";

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

  return (
    <div className="container-sub">
      <HeaderCL
        icon={FaAsterisk}
        title="Teams"
        titleDropDown={
          hasPermission(userData.role as Role, "create:team") && (
            <Link href="/protected/teams/create-team">
              <Button size="sm" className="gap-2">
                <FaPlus />
                Crea nuovo team
              </Button>
            </Link>
          )
        }
      />


      {/* --- Team List --- */}
      {churchTeams.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-gray-500">
          <p className="text-lg">Nessun team trovato.</p>
        </div>
      ) : (
        <div className="border max-w-[1000px] border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
          {churchTeams.map((team) => (
            <Link
              key={team.id}
              href={`/protected/teams/${team.id}`}
              className="group flex items-center justify-between p-4 hover:bg-gray-50 transition duration-150 ease-in-out"
            >
              <div className="flex flex-col">
                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {team.team_name}
                  {team.is_worship && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      Worship Team
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Leader: {team.leaders.join(", ")}
                </p>
                <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                  Membri:{" "}
                  {team.teamMembers
                    .map((member) => `${member.name} ${member.lastname}`)
                    .join(", ")}
                </p>
              </div>
              <MdOpenInNew
                size={20}
                className="text-gray-400 group-hover:text-blue-600 transition-colors"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
