"use client";
import { getProfileById } from "@/hooks/GET/getProfileById";
import { getProfileSetList } from "@/hooks/GET/getProfileSetLists";
import { getTeamsByProfile } from "@/hooks/GET/getTeamsByProfile";
import {
  ChipColor,
  profileSetlistsT,
  profileT,
  profileTeamsT,
} from "@/utils/types/types";
import { basicUserData } from "@/utils/types/userData";
import { MdEvent } from "react-icons/md";

import ModalRoleUpdate from "./modalRoleUpdate";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import ChurchLabLoader from "@/app/components/churchLabSpinner";
import { statusColorMap, statusMap } from "@/constants";
import { Chip } from "@heroui/chip";
import { FaRegCheckCircle, FaRegClock } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";

export default function PeopleIdComponent({
  params,
}: {
  params: { peopleId: string };
}) {
  const { userData, loading } = useUserStore();
  const [profile, setProfile] = useState<profileT | null>(null);
  const [profileSetlist, setProfileSetlist] = useState<profileSetlistsT[]>([]);
  const [profileTeams, setProfileTeams] = useState<profileTeamsT[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      const fetchedProfile = await getProfileById(params.peopleId);
      setProfile(fetchedProfile);
      const fetchedSetlists = await getProfileSetList(params.peopleId);
      setProfileSetlist(fetchedSetlists);
      const fetchedTeams = await getTeamsByProfile(params.peopleId);
      setProfileTeams(fetchedTeams);
      setLoadingSongs(false);
    };
    fetchSongs();
  }, [userData?.loggedIn, params.peopleId]);

  if (loading || loadingSongs) return <ChurchLabLoader />;

  if (!profile)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-600">
        <p className="text-lg">Profilo non trovato.</p>
      </div>
    );

  if (!hasPermission(userData.role as Role, "read:churchmembers"))
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6 text-gray-700 max-w-md mx-auto">
        <h3 className="text-2xl font-semibold mb-2">Accesso negato.</h3>
        <p>
          Per motivi di privacy solo gli amministratori della chiesa e i
          responsabili di team possono visualizzare questa pagina.
        </p>
      </div>
    );

  const currentDate = new Date();

  return (
    <main className="max-w-xl w-full mx-auto px-6 py-8 font-sans text-gray-900">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          {profile.name} {profile.lastname}
        </h1>
        <p className="mt-1 text-gray-500">{profile.email}</p>
        <div className="mt-4">
          <ModalRoleUpdate
            peopleId={params.peopleId}
            profile={profile}
            userData={userData}
          />
        </div>
      </header>

      {/* Teams */}
      {profileTeams.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
            Team di {profile.name}
          </h2>
          <ul className="space-y-3">
            {profileTeams.map((team, idx) => (
              <li key={idx} className=" space-x-3 bg-white p-2 ">
                <p className="font-semibold">{team.team_name}</p>
                {team.roles && team.roles.length > 0 && (
                  <p className="text-gray-500 italic text-sm">
                    ({team.roles.join(", ")})
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Upcoming Events */}
      {profileSetlist.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-6 pb-2 flex items-center gap-2">
            <MdEvent size={26} className="text-gray-600" />
            Prossimi eventi
          </h2>

          <ul className="space-y-6 w-full">
            {profileSetlist
              .filter((setlist) => new Date(setlist.date) > currentDate)
              .map((setlist, idx) => {
                const date = new Date(setlist.date);
                const readableDate = date.toLocaleDateString("it-IT", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
                const status = statusMap[setlist.status] ?? {
                  label: "Sconosciuto",
                  color: "text-gray-500",
                };
                const colorChip: ChipColor =
                  statusColorMap[setlist.status] ?? "default";
                return (
                  <li key={idx} className="bg-white w-full w-max-[500px] p-2 ">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">
                        {setlist.event_title}
                      </h3>
                      <div className="sm-hide">
                        <Chip
                          className="capitalize text-center"
                          color={colorChip}
                          size="sm"
                          variant="flat"
                        >
                          <span className={status.color}>{status.label}</span>
                        </Chip>
                      </div>
                      <div className="md-hide">
                        {setlist.status === "confirmed" && (
                          <FaRegCheckCircle color={status.color} />
                        )}
                        {setlist.status === "pending" && (
                          <FaRegClock color={status.color} />
                        )}
                        {setlist.status === "denied" && (
                          <FaRegCircleXmark color={status.color} />
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-1 capitalize">
                      {readableDate}
                    </p>
                    <p className="text-gray-800 mb-4 capitalize">
                      Team: {setlist.team_name}
                    </p>
                    <a
                      href={`/setlist/${setlist.setlist_id}`}
                      className="text-blue-600 font-semibold hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Vai alla pagina evento ${setlist.event_title}`}
                    >
                      Pagina evento →
                    </a>
                  </li>
                );
              })}
          </ul>
        </section>
      )}
    </main>
  );
}
