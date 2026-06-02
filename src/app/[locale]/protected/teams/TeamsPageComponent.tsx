"use client";
import { Link } from "@/i18n/navigation";
import { useEffect, useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { TbChevronRight, TbCrown } from "react-icons/tb";
import { useUserStore } from "@/store/useUserStore";
import { Button, Input, Chip } from "@heroui/react";
import { getTeamsByChurch } from "@/hooks/GET/getTeamsByChurch";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { Team } from "@/utils/types/types";
import { HeaderCL } from "@/app/[locale]/components/header-comp";
import ChurchLabLoader from "@/app/[locale]/components/churchLabSpinner";
import { MdPeople } from "react-icons/md";

type FilterType = "all" | "worship" | "other";

const AVATAR_COLORS = [
  { bg: "bg-purple-100", text: "text-purple-800" },
  { bg: "bg-teal-100", text: "text-teal-800" },
  { bg: "bg-orange-100", text: "text-orange-900" },
  { bg: "bg-pink-100", text: "text-pink-800" },
  { bg: "bg-blue-100", text: "text-blue-800" },
  { bg: "bg-green-100", text: "text-green-800" },
  { bg: "bg-amber-100", text: "text-amber-900" },
  { bg: "bg-red-100", text: "text-red-800" },
];

const TEAM_ICON_COLORS = [
  { bg: "bg-purple-100", text: "text-purple-800" },
  { bg: "bg-teal-100", text: "text-teal-800" },
  { bg: "bg-blue-100", text: "text-blue-800" },
  { bg: "bg-green-100", text: "text-green-800" },
  { bg: "bg-amber-100", text: "text-amber-900" },
];

function getInitials(name: string, lastname: string) {
  return `${name[0] ?? ""}${lastname[0] ?? ""}`.toUpperCase();
}

function MemberAvatars({
  members,
}: {
  members: { name?: string; lastname?: string }[];
}) {
  const MAX = 4;
  const visible = members.slice(0, MAX);
  const overflow = members.length - MAX;
  return (
    <div className="flex mt-1">
      {visible.map((m, i) => {
        const c = AVATAR_COLORS[i % AVATAR_COLORS.length];
        const label = `${m.name ?? ""} ${m.lastname ?? ""}`.trim();
        return (
          <div
            key={i}
            title={label}
            className={`w-5 h-5 rounded-full border-2 border-white dark:border-default-100 -ml-1 first:ml-0 flex items-center justify-center text-[9px] font-medium flex-shrink-0 ${c.bg} ${c.text}`}
            aria-hidden="true"
          >
            {getInitials(m.name ?? "", m.lastname ?? "")}
          </div>
        );
      })}
      {overflow > 0 && (
        <div className="w-5 h-5 rounded-full border-2 border-white dark:border-default-100 -ml-1 flex items-center justify-center text-[9px] font-medium bg-default-200 text-default-500 flex-shrink-0">
          +{overflow}
        </div>
      )}
    </div>
  );
}

export default function TeamsPageComponent() {
  const { userData, loading } = useUserStore();
  const [churchTeams, setChurchTeam] = useState<Team[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  useEffect(() => {
    if (!loading && userData.loggedIn) {
      getTeamsByChurch(userData.church_id).then((fetchedChurchTeams) => {
        setChurchTeam(fetchedChurchTeams);
      });
    }
  }, [loading, userData]);

  const filteredTeams = useMemo(() => {
    if (!churchTeams) return null;
    const q = searchQuery.toLowerCase();
    return churchTeams.filter((t) => {
      const matchSearch =
        t.team_name.toLowerCase().includes(q) ||
        t.leaders.some((l) => l.toLowerCase().includes(q));
      const matchFilter =
        activeFilter === "all" ||
        (activeFilter === "worship" && t.is_worship) ||
        (activeFilter === "other" && !t.is_worship);
      return matchSearch && matchFilter;
    });
  }, [churchTeams, searchQuery, activeFilter]);

  const worshipCount = churchTeams?.filter((t) => t.is_worship).length ?? 0;
  const totalMembers =
    churchTeams?.reduce((sum, t) => sum + t.teamMembers.length, 0) ?? 0;

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: "Tutti", value: "all" },
    { label: "Worship", value: "worship" },
    { label: "Altri", value: "other" },
  ];

  return (
    <div className="flex flex-col gap-4 w-full p-2 max-w-4xl mx-auto">
      {/* Stats Row */}
      {churchTeams && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-default-100 rounded-xl p-3">
            <p className="text-xs text-default-500 mb-1">Team totali</p>
            <p className="text-2xl font-medium">{churchTeams.length}</p>
          </div>
          <div className="bg-default-100 rounded-xl p-3">
            <p className="text-xs text-default-500 mb-1">Worship team</p>
            <p className="text-2xl font-medium">{worshipCount}</p>
          </div>
          <div className="bg-default-100 rounded-xl p-3">
            <p className="text-xs text-default-500 mb-1">Membri totali</p>
            <p className="text-2xl font-medium">{totalMembers}</p>
          </div>
        </div>
      )}

      {/* Search + Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          className="flex-1 min-w-[180px]"
          placeholder="Cerca team…"
          size="sm"
          startContent={<FiSearch className="text-default-400" />}
          value={searchQuery}
          onValueChange={setSearchQuery}
          isClearable
          onClear={() => setSearchQuery("")}
        />
        <div className="flex gap-1">
          {filterButtons.map(({ label, value }) => (
            <Button
              key={value}
              size="sm"
              variant={activeFilter === value ? "solid" : "flat"}
              color={activeFilter === value ? "primary" : "default"}
              onPress={() => setActiveFilter(value)}
            >
              {label}
            </Button>
          ))}
        </div>
        {hasPermission(userData?.role as Role, "create:teams") && (
          <Button
            as={Link}
            href="/protected/teams/new"
            size="sm"
            variant="flat"
            color="primary"
            startContent={<FaPlus size={11} />}
          >
            Nuovo team
          </Button>
        )}
      </div>

      {/* Teams List */}
      {!filteredTeams ? (
        <ChurchLabLoader height="300px" />
      ) : filteredTeams.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-14 text-default-400 border border-divider rounded-xl">
          <MdPeople size={32} />
          <p className="text-sm">Nessun team trovato.</p>
        </div>
      ) : (
        <div className="border border-divider rounded-xl overflow-hidden">
          {filteredTeams.map((team, idx) => {
            const iconIndex =
              typeof team.id === "number" ? team.id : Number(team.id);
            const ic =
              TEAM_ICON_COLORS[
                Number.isInteger(iconIndex)
                  ? Math.abs(iconIndex) % TEAM_ICON_COLORS.length
                  : 0
              ];
            return (
              <Link
                key={team.id}
                href={`/protected/teams/${team.id}`}
                className={`group flex items-center justify-between px-4 py-3 transition-colors hover:bg-default-50 ${
                  idx < filteredTeams.length - 1
                    ? "border-b border-divider"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Team icon */}
                  <div
                    className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center ${ic.bg} ${ic.text}`}
                    aria-hidden="true"
                  >
                    <MdPeople size={17} />
                  </div>

                  <div className="min-w-0">
                    {/* Name + badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-default-900 group-hover:text-primary transition-colors">
                        {team.team_name}
                      </span>
                      {team.is_worship && (
                        <Chip size="sm" variant="flat" color="primary">
                          Worship Team
                        </Chip>
                      )}
                    </div>

                    {/* Leaders */}
                    <p className="text-xs text-default-500 mt-0.5 flex items-center gap-1">
                      <TbCrown size={11} className="flex-shrink-0" />
                      <span className="truncate">
                        {team.leaders.join(", ")}
                      </span>
                    </p>

                    {/* Member avatars */}
                    <MemberAvatars members={team.teamMembers} />
                  </div>
                </div>

                <TbChevronRight
                  size={16}
                  className="text-default-300 group-hover:text-primary flex-shrink-0 transition-colors"
                />
              </Link>
            );
          })}

          {/* Footer */}
          <div className="px-4 py-2 bg-default-50 border-t border-divider text-xs text-default-400">
            {filteredTeams.length} di {churchTeams?.length ?? 0} team mostrati
          </div>
        </div>
      )}
    </div>
  );
}
