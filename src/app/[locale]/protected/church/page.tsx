"use client";
import { profileT } from "@/utils/types/types";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState, useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { getProfilesByChurch } from "@/hooks/GET/getProfilesByChurch";
import { HeaderCL } from "@/app/[locale]/components/header-comp";
import { PiChurch } from "react-icons/pi";
import { FaUserPlus, FaRegEye } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button, Input, Chip } from "@heroui/react";

type FilterType = "all" | "admin" | "leader";

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

function getInitials(name: string, lastname: string) {
  return `${name[0] ?? ""}${lastname[0] ?? ""}`.toUpperCase();
}

function getAvatarColor(id: string | number) {
  const numericId =
    typeof id === "number"
      ? id
      : [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return AVATAR_COLORS[numericId % AVATAR_COLORS.length];
}

function RoleBadge({ role }: { role: number }) {
  if (role <= 2)
    return (
      <Chip size="sm" variant="flat" color="secondary">
        Admin
      </Chip>
    );
  if (role === 3)
    return (
      <Chip size="sm" variant="flat" color="success">
        Team leader
      </Chip>
    );
  return (
    <Chip size="sm" variant="flat" color="default">
      Membro
    </Chip>
  );
}

export default function ChurchComponent() {
  const { userData, loading } = useUserStore();
  const [profiles, setProfiles] = useState<profileT[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  useEffect(() => {
    console.log(userData?.role, "userROLE");
    if (hasPermission(userData?.role as Role, "read:churchmembers")) {
      console.log("Fetching profiles for church:", userData?.church_id);
      getProfilesByChurch(userData?.church_id).then(
        (fetchedPeople: profileT[]) => {
          setProfiles(fetchedPeople ?? []);
        },
      );
    }
  }, [loading, userData]);

  const filteredProfiles = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return profiles.filter((p) => {
      const matchesSearch =
        `${p.name} ${p.lastname}`.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q);
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "admin" && p.role <= 2) ||
        (activeFilter === "leader" && p.role === 3);
      return matchesSearch && matchesFilter;
    });
  }, [profiles, searchQuery, activeFilter]);

  const adminCount = profiles.filter((p) => p.role <= 2).length;
  const leaderCount = profiles.filter((p) => p.role === 3).length;

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: "Tutti", value: "all" },
    { label: "Admin", value: "admin" },
    { label: "Leader", value: "leader" },
  ];

  return (
    <div className="flex flex-col gap-4 w-full p-2 max-w-4xl mx-auto">
      {/* Header */}
      <HeaderCL
        icon={PiChurch}
        title={userData?.church_name}
        titleDropDown={
          <Link
            href="/protected/church/invitemembers"
            className="flex flex-row gap-2 items-center bg-blue-100 text-blue-800 py-2 px-3 sm:px-4 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
          >
            <FaUserPlus />
            <span className="hidden sm:block">Invita membri</span>
          </Link>
        }
      />

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-default-100 rounded-xl p-3">
          <p className="text-xs text-default-500 mb-1">Membri totali</p>
          <p className="text-2xl font-medium">{profiles.length}</p>
        </div>
        <div className="bg-default-100 rounded-xl p-3">
          <p className="text-xs text-default-500 mb-1">Admin</p>
          <p className="text-2xl font-medium">{adminCount}</p>
        </div>
        <div className="bg-default-100 rounded-xl p-3">
          <p className="text-xs text-default-500 mb-1">Team leader</p>
          <p className="text-2xl font-medium">{leaderCount}</p>
        </div>
      </div>

      {/* Search + Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Input
          className="flex-1 min-w-[180px]"
          placeholder="Cerca per nome o email…"
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
      </div>

      {/* Table */}
      <div className="border border-divider rounded-xl overflow-hidden">
        <table className="w-full" style={{ tableLayout: "fixed" }}>
          <thead className="bg-default-50">
            <tr>
              <th
                className="text-left text-xs font-medium text-default-500 uppercase tracking-wide px-4 py-2.5 border-b border-divider"
                style={{ width: "44%" }}
              >
                Nome
              </th>
              <th
                className="text-left text-xs font-medium text-default-500 uppercase tracking-wide px-4 py-2.5 border-b border-divider hidden sm:table-cell"
                style={{ width: "30%" }}
              >
                Email
              </th>
              <th
                className="text-left text-xs font-medium text-default-500 uppercase tracking-wide px-4 py-2.5 border-b border-divider hidden sm:table-cell"
                style={{ width: "16%" }}
              >
                Ruolo
              </th>
              <th
                className="px-4 py-2.5 border-b border-divider"
                style={{ width: "10%" }}
              />
            </tr>
          </thead>
          <tbody>
            {filteredProfiles.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-default-400 text-sm py-10"
                >
                  Nessun membro trovato
                </td>
              </tr>
            ) : (
              filteredProfiles.map((item) => {
                const avatarColor = getAvatarColor(item.id);
                return (
                  <tr
                    key={item.id}
                    className="border-b border-divider last:border-b-0 hover:bg-default-50 transition-colors"
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-medium ${avatarColor.bg} ${avatarColor.text}`}
                          aria-hidden="true"
                        >
                          {getInitials(item.name, item.lastname)}
                        </div>
                        <span className="text-sm truncate">
                          {item.name} {item.lastname}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 hidden sm:table-cell text-sm text-default-500 truncate">
                      {item.email}
                    </td>
                    <td className="px-4 py-2.5 hidden sm:table-cell">
                      <RoleBadge role={item.role} />
                    </td>
                    <td className="px-4 py-2.5">
                      {hasPermission(
                        userData?.role as Role,
                        "update:teams",
                      ) && (
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              aria-label={`Azioni per ${item.name} ${item.lastname}`}
                            >
                              <BsThreeDotsVertical />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Azioni membro">
                            <DropdownItem
                              key="view"
                              as={Link}
                              startContent={<FaRegEye />}
                              href={`/people/${item.id}`}
                            >
                              Visualizza dettagli
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Footer info */}
        <div className="px-4 py-2 bg-default-50 border-t border-divider text-xs text-default-400">
          {filteredProfiles.length} di {profiles.length} membri mostrati
        </div>
      </div>
    </div>
  );
}
