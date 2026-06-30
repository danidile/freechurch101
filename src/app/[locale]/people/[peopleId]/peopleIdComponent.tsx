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
import { useUserStore } from "@/store/useUserStore";
import { ReactNode, useEffect, useState } from "react";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import ChurchLabLoader from "@/app/[locale]/components/churchLabSpinner";
import { roles, statusColorMap, statusMap } from "@/constants";
import { Chip } from "@heroui/chip";
import {
  MdCake,
  MdCalendarToday,
  MdEmail,
  MdEvent,
  MdGroups,
  MdLocationOn,
  MdPerson,
  MdPhone,
  MdWaterDrop,
} from "react-icons/md";
import { Link } from "@/i18n/navigation";
import ModalRoleUpdate from "./modalRoleUpdate";

type FullProfile = profileT & {
  avatar_url?: string;
  phone?: string;
  auth_id?: string | null;
  created_at?: string;
  birthday?: string;
  baptism_date?: string;
  address?: string;
  city?: string;
  province?: string;
  cap?: string;
};

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5">
      <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className="text-sm text-gray-900 text-right">{value || "—"}</span>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

export default function PeopleIdComponent({
  params,
}: {
  params: { peopleId: string };
}) {
  const { userData, loading } = useUserStore();
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [profileSetlist, setProfileSetlist] = useState<profileSetlistsT[]>([]);
  const [profileTeams, setProfileTeams] = useState<profileTeamsT[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [tab, setTab] = useState<"profilo" | "team" | "eventi">("profilo");

  useEffect(() => {
    const fetchData = async () => {
      const fetchedProfile = await getProfileById(params.peopleId);
      setProfile(fetchedProfile);
      const fetchedSetlists = await getProfileSetList(params.peopleId);
      setProfileSetlist((fetchedSetlists ?? []) as profileSetlistsT[]);
      const fetchedTeams = await getTeamsByProfile(params.peopleId);
      setProfileTeams((fetchedTeams ?? []) as profileTeamsT[]);
      setLoadingSongs(false);
    };
    fetchData();
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

  const now = new Date();
  const isActive = !!profile.auth_id;
  const roleLabel =
    roles.find((r) => r.key === profile.role)?.label ?? "Membro";
  const initials =
    `${profile.name?.[0] ?? ""}${profile.lastname?.[0] ?? ""}`.toUpperCase() ||
    "?";

  const fmtDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("it-IT", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "—";

  const upcoming = profileSetlist.filter((s) => new Date(s.date) > now);
  const past = profileSetlist.filter((s) => new Date(s.date) <= now);

  const renderEvent = (setlist: profileSetlistsT, idx: number) => {
    const date = new Date(setlist.date);
    const readableDate = date.toLocaleDateString("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const status = statusMap[setlist.status] ?? {
      label: "Sconosciuto",
      color: "#6b7280",
    };
    const colorChip: ChipColor = statusColorMap[setlist.status] ?? "default";
    return (
      <div
        key={idx}
        className="flex items-center justify-between gap-3 py-3 border-t border-gray-100 first:border-0"
      >
        <div className="min-w-0">
          <h3 className="font-medium truncate">{setlist.event_title}</h3>
          <p className="text-sm text-gray-500 capitalize">
            {readableDate} · {setlist.team_name}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Chip
            className="capitalize"
            color={colorChip}
            size="sm"
            variant="flat"
          >
            <span style={{ color: status.color }}>{status.label}</span>
          </Chip>
          <Link
            href={`/setlist/${setlist.setlist_id}`}
            className="text-blue-600 text-sm font-medium hover:underline whitespace-nowrap"
            aria-label={`Vai alla pagina evento ${setlist.event_title}`}
          >
            Pagina evento →
          </Link>
        </div>
      </div>
    );
  };

  const tabBtn = (value: typeof tab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(value)}
      className={`pb-3 -mb-[13px] border-b-2 transition-colors ${
        tab === value
          ? "border-gray-900 font-medium text-gray-900"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <main className="max-w-5xl w-full mx-auto px-4 py-6 sm:py-8 text-gray-900">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 mb-4">
        <div className="flex items-start gap-4">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={`${profile.name ?? ""} ${profile.lastname ?? ""}`}
              className="w-16 h-16 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-medium shrink-0">
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">
              {profile.name} {profile.lastname}
            </h1>
            <div className="mt-1 text-sm text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1">
              {profile.email && (
                <span className="inline-flex items-center gap-1">
                  <MdEmail /> {profile.email}
                </span>
              )}
              {profile.phone && (
                <span className="inline-flex items-center gap-1">
                  <MdPhone /> {profile.phone}
                </span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip color="primary" variant="flat" size="sm">
                {roleLabel}
              </Chip>
              <Chip
                color={isActive ? "success" : "default"}
                variant="flat"
                size="sm"
              >
                {isActive ? "Attivo" : "Inattivo"}
              </Chip>
            </div>
          </div>

          <div className="shrink-0">
            <ModalRoleUpdate
              peopleId={params.peopleId}
              profile={profile}
              userData={userData}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5 border-t border-gray-100 pt-3 flex gap-6 text-sm">
          {tabBtn("profilo", "Profilo")}
          {tabBtn("team", "Team")}
          {tabBtn("eventi", "Eventi")}
        </div>
      </div>

      {/* Profilo tab */}
      {tab === "profilo" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <SectionCard title="Informazioni di contatto">
              <InfoRow
                icon={<MdEmail className="text-gray-400" />}
                label="Email"
                value={profile.email}
              />
              <InfoRow
                icon={<MdPhone className="text-gray-400" />}
                label="Telefono"
                value={profile.phone}
              />
            </SectionCard>

            <SectionCard title="Informazioni personali">
              <InfoRow
                icon={<MdPerson className="text-gray-400" />}
                label="Username"
                value={profile.username ? `@${profile.username}` : undefined}
              />
              <InfoRow
                icon={<MdCake className="text-gray-400" />}
                label="Data di nascita"
                value={fmtDate(profile.birthday)}
              />
              <InfoRow
                icon={<MdWaterDrop className="text-gray-400" />}
                label="Data di battesimo"
                value={fmtDate(profile.baptism_date)}
              />
              <InfoRow
                icon={<MdCalendarToday className="text-gray-400" />}
                label="Membro dal"
                value={fmtDate(profile.created_at)}
              />
            </SectionCard>

            <SectionCard
              title="Indirizzo"
              icon={<MdLocationOn className="text-gray-400" />}
            >
              <InfoRow label="Via" value={profile.address} />
              <InfoRow label="Città" value={profile.city} />
              <InfoRow label="Provincia" value={profile.province} />
              <InfoRow label="CAP" value={profile.cap} />
            </SectionCard>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Eventi" value={profileSetlist.length} />
              <StatCard label="Team" value={profileTeams.length} />
            </div>

            <SectionCard title="Team e ruoli" icon={<MdGroups />}>
              {profileTeams.length ? (
                <div className="divide-y divide-gray-100">
                  {profileTeams.map((team, idx) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0">
                      <p className="font-medium">{team.team_name}</p>
                      {team.roles && team.roles.length > 0 && (
                        <p className="text-sm text-gray-500">
                          {team.roles.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Nessun team.</p>
              )}
            </SectionCard>
          </div>
        </div>
      )}

      {/* Team tab */}
      {tab === "team" && (
        <SectionCard title="Team e ruoli" icon={<MdGroups />}>
          {profileTeams.length ? (
            <div className="divide-y divide-gray-100">
              {profileTeams.map((team, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0">
                  <p className="font-medium">{team.team_name}</p>
                  {team.roles && team.roles.length > 0 && (
                    <p className="text-sm text-gray-500 italic">
                      {team.roles.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Nessun team.</p>
          )}
        </SectionCard>
      )}

      {/* Eventi tab */}
      {tab === "eventi" && (
        <div className="flex flex-col gap-4">
          <SectionCard title="Prossimi eventi" icon={<MdEvent />}>
            {upcoming.length ? (
              upcoming.map(renderEvent)
            ) : (
              <p className="text-sm text-gray-500">
                Nessun evento in programma.
              </p>
            )}
          </SectionCard>

          <SectionCard title="Eventi passati">
            {past.length ? (
              past.map(renderEvent)
            ) : (
              <p className="text-sm text-gray-500">Nessun evento passato.</p>
            )}
          </SectionCard>
        </div>
      )}
    </main>
  );
}
