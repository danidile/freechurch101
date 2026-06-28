"use client";

import { useState } from "react";
import React from "react";
import { IconType } from "react-icons";
import { useUserStore } from "@/store/useUserStore";
import { useRouter, Link } from "@/i18n/navigation";

import {
  LuUser,
  LuMail,
  LuPhone,
  LuShield,
  LuChurch,
  LuCalendarOff,
  LuLogs,
  LuInbox,
} from "react-icons/lu";
import { FaAsterisk, FaRegQuestionCircle } from "react-icons/fa";
import { MdFamilyRestroom, MdOutlineLogout } from "react-icons/md";

import { Chip } from "@heroui/react";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import ChurchLabLoader from "@/app/[locale]/components/churchLabSpinner";

import NotificationPage from "@/app/[locale]/notifications/page";
import TeamsPageComponent from "../../teams/TeamsPageComponent";
import BlockDatesComponent from "../../blockouts/blockDatesComponent";
import PersonalizeChurchComponent from "../../church/personalize/page";
import TicketSystem from "../../tickets/page";
import LogsPage from "@/app/[locale]/admin/logs/page";
import FamilyPage from "../family/page";
import logoutAction from "@/app/[locale]/components/logOutAction";

type Section =
  | "profile"
  | "church"
  | "security"
  | "notifications"
  | "blockouts"
  | "personalize"
  | "tickets"
  | "logs"
  | "teams"
  | "logout";

export default function AccountPage() {
  const { userData, loading, fetchUser } = useUserStore();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>("profile");
  async function logouter() {
    await logoutAction();
    await fetchUser();
    router.push("/protected/dashboard/account");
  }

  const isAdmin = hasPermission(userData?.role as Role, "personalize:church");
  const hasTeam = !!userData?.teams?.length;
  const isLeader = !!userData?.teams?.some((team) => team.role === "leader");

  const navItems: {
    key: Section;
    label: string;
    icon: React.ReactNode;
    color: string;
    show: boolean;
    action?: () => void;
  }[] = [
    {
      key: "profile",
      label: "Profilo",
      icon: <LuUser size={16} />,
      color: "bg-primary/10 text-primary",
      show: true,
    },
    {
      key: "teams",
      label: "Teams",
      icon: <FaAsterisk size={15} />,
      color: "bg-teal-100 text-teal-700",
      show: hasTeam || isLeader || isAdmin,
    },
    {
      key: "blockouts",
      label: "Blocca Date",
      icon: <LuCalendarOff size={16} />,
      color: "bg-red-100 text-red-700",
      show: !!userData?.church_id,
    },
    {
      key: "personalize",
      label: "Personalizza Chiesa",
      icon: <LuChurch size={16} />,
      color: "bg-amber-100 text-amber-700",
      show: isAdmin,
    },
    {
      key: "security",
      label: "Sicurezza",
      icon: <LuShield size={16} />,
      color: "bg-green-100 text-green-700",
      show: true,
    },
    {
      key: "logs",
      label: "Logs",
      icon: <LuLogs size={16} />,
      color: "bg-default-200 text-default-600",
      show: userData?.email === "danidile94@gmail.com",
    },
    {
      key: "tickets",
      label: "Support Tickets",
      icon: <FaRegQuestionCircle size={16} />,
      color: "bg-blue-100 text-blue-700",
      show: true,
    },
    {
      key: "logout",
      label: "Esci",
      icon: <MdOutlineLogout size={16} />,
      color: "bg-red-100 text-red-700",
      show: true,
      action: logouter,
    },
  ];

  const handleNav = (item: (typeof navItems)[number]) => {
    if (item.action) item.action();
    else setActiveSection(item.key);
  };

  const initials =
    `${userData?.name?.[0] || ""}${userData?.lastname?.[0] || ""}`.toUpperCase();
  const SUPABASE_URL =
    "https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public";

  const avatarSrc = userData?.avatar_url
    ? `${SUPABASE_URL}/avatars/${userData.avatar_url}?t=${Date.now()}`
    : null;

  const churchLogoSrc = userData?.church_logo
    ? `${SUPABASE_URL}/churchlogo/${userData.church_logo}?t=${Date.now()}`
    : null;

  if (loading || !userData) return <ChurchLabLoader />;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="flex items-center gap-4 sm:gap-5 pb-6 mb-6 border-b border-divider">
        <div className="relative flex-shrink-0">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="Avatar"
              className="rounded-full object-cover w-[72px] h-[72px]"
            />
          ) : (
            <div className="w-[72px] h-[72px] rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-semibold">
              {initials || "?"}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-default-900 truncate">
            {userData?.name} {userData?.lastname}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-1">
            {userData?.email && (
              <p className="text-sm text-default-500 truncate">
                {userData.email}
              </p>
            )}
            {userData?.phone && (
              <p className="text-sm text-default-500">{userData.phone}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Chip
              size="sm"
              variant="flat"
              color="primary"
              className="capitalize"
            >
              {userData?.role || "Membro"}
            </Chip>
            {userData?.church_name && (
              <span className="text-xs text-default-400">
                · {userData.church_name}
              </span>
            )}
            {userData?.pending_church_confirmation && (
              <Chip size="sm" variant="flat" color="warning">
                In attesa di approvazione
              </Chip>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
        {/* Sidebar nav */}
        <aside className="md:w-56 flex-shrink-0">
          {/* Mobile: horizontal scrollable pills */}
          <nav className="flex md:hidden gap-1 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
            {navItems
              .filter((item) => item.show)
              .map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNav(item)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium flex-shrink-0 transition-colors ${
                    activeSection === item.key
                      ? item.color
                      : "text-default-500 hover:bg-default-100 hover:text-default-700"
                  }`}
                >
                  {item.icon}
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              ))}
          </nav>

          {/* Desktop: vertical sidebar */}
          <nav className="hidden md:flex flex-col gap-0.5">
            {navItems
              .filter((item) => item.show)
              .map((item) => {
                const active = activeSection === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNav(item)}
                    className={`group flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                      active
                        ? "bg-default-100 text-default-900"
                        : "text-default-500 hover:bg-default-50 hover:text-default-900"
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        active
                          ? item.color
                          : "bg-default-100 text-default-500 group-hover:text-default-700"
                      }`}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                );
              })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* ── PROFILE (overview + notifications + family) ── */}
          {activeSection === "profile" && (
            <div className="flex flex-col gap-6">
              {/* Overview — compact */}
              <div className="bg-content1 rounded-xl border border-divider p-4 sm:p-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-4">
                  <InfoCell
                    icon={LuMail}
                    iconColor="bg-blue-100 text-blue-700"
                    label="Email"
                    value={userData?.email || "—"}
                  />
                  <InfoCell
                    icon={LuPhone}
                    iconColor="bg-green-100 text-green-700"
                    label="Telefono"
                    value={userData?.phone || "—"}
                  />
                  <InfoCell
                    icon={LuShield}
                    iconColor="bg-purple-100 text-purple-700"
                    label="Ruolo"
                    value={userData?.role || "Membro"}
                    valueClassName="capitalize"
                  />
                  <InfoCell
                    icon={LuChurch}
                    iconColor="bg-amber-100 text-amber-700"
                    label="Chiesa"
                    value={userData?.church_name || "—"}
                  />
                </div>
              </div>

              {/* Notifications + Family */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <SectionCard
                  title="Notifiche"
                  description="Tutti gli aggiornamenti e gli avvisi che riguardano la tua attività."
                  icon={LuInbox}
                  iconColor="bg-blue-100 text-blue-700"
                >
                  <NotificationPage />
                </SectionCard>

                <SectionCard
                  title="Famiglia"
                  description="Gestisci le informazioni relative alla tua famiglia."
                  icon={MdFamilyRestroom}
                  iconColor="bg-pink-100 text-pink-700"
                >
                  <div className="w-full mx-auto">
                    <FamilyPage />
                  </div>
                </SectionCard>
              </div>
            </div>
          )}

          {/* ── Blockouts ── */}
          {activeSection === "blockouts" && (
            <SectionCard
              border={false}
              title="Blocca Date"
              description="Gestisci i periodi in cui non sarai disponibile per le turnazioni."
              icon={LuCalendarOff}
              iconColor="bg-red-100 text-red-700"
            >
              <BlockDatesComponent />
            </SectionCard>
          )}

          {/* ── Personalize ── */}
          {activeSection === "personalize" && (
            <SectionCard
              title="Personalizza Chiesa"
              description="Gestisci le impostazioni visive della tua chiesa."
              icon={LuChurch}
              iconColor="bg-amber-100 text-amber-700"
            >
              <PersonalizeChurchComponent />
            </SectionCard>
          )}

          {/* ── Teams ── */}
          {activeSection === "teams" && (
            <SectionCard
              border={false}
              title="Teams"
              description="Gestisci i team della tua chiesa."
              icon={FaAsterisk}
              iconColor="bg-teal-100 text-teal-700"
            >
              <TeamsPageComponent />
            </SectionCard>
          )}

          {/* ── Church ── */}
          {activeSection === "church" && (
            <SectionCard
              title="Chiesa"
              icon={LuChurch}
              iconColor="bg-amber-100 text-amber-700"
            >
              <div className="flex items-center gap-4 p-4 rounded-xl border border-divider bg-default-50">
                {churchLogoSrc ? (
                  <img
                    src={churchLogoSrc}
                    alt="Logo chiesa"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <LuChurch size={22} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-medium text-default-900">
                    {userData?.church_name || "—"}
                  </p>
                  <p className="text-xs text-default-400 mt-0.5">
                    Ruolo:{" "}
                    <span className="font-medium text-default-600 capitalize">
                      {userData?.role || "Membro"}
                    </span>
                  </p>
                </div>
                {userData?.pending_church_confirmation && (
                  <Chip
                    size="sm"
                    variant="flat"
                    color="warning"
                    className="ml-auto"
                  >
                    In attesa di approvazione
                  </Chip>
                )}
              </div>
            </SectionCard>
          )}

          {/* ── Security ── */}
          {activeSection === "security" && (
            <SectionCard
              border={false}
              title="Sicurezza"
              description="Gestisci le credenziali del tuo account."
              icon={LuShield}
              iconColor="bg-green-100 text-green-700"
            >
              <div className="rounded-xl border border-divider overflow-hidden">
                <SecurityRow
                  label="Password"
                  value="••••••••••••"
                  action="Cambia password"
                  href="/protected/reset-password"
                />
                <SecurityRow
                  label="Email di accesso"
                  value={userData?.email || "—"}
                  last
                />
              </div>
            </SectionCard>
          )}

          {/* ── Logs ── */}
          {activeSection === "logs" && (
            <SectionCard
              title="Logs Dashboard"
              icon={LuLogs}
              iconColor="bg-default-200 text-default-600"
            >
              <LogsPage />
            </SectionCard>
          )}

          {/* ── Tickets ── */}
          {activeSection === "tickets" && (
            <SectionCard
              border={false}
              title="Support Tickets"
              description={`Benvenuto, ${userData.name}`}
              icon={FaRegQuestionCircle}
              iconColor="bg-blue-100 text-blue-700"
            >
              <TicketSystem />
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── SUB-COMPONENTS ── */

function SectionCard({
  title,
  icon: Icon,
  iconColor = "bg-primary/10 text-primary",
  description,
  children,
  border = true,
}: {
  title: string;
  icon?: IconType;
  iconColor?: string;
  description?: string;
  children: React.ReactNode;
  border?: boolean;
}) {
  return (
    <div
      className={`bg-content1 rounded-xl  border-divider p-4 sm:p-6 ${border ? "border" : ""}`}
    >
      <div className="flex items-start gap-3 mb-5">
        {Icon && (
          <span
            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor}`}
          >
            <Icon size={18} />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-default-900">{title}</h2>
          {description && (
            <p className="text-sm text-default-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function InfoCell({
  icon: Icon,
  iconColor,
  label,
  value,
  valueClassName = "",
}: {
  icon: IconType;
  iconColor: string;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <span
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor}`}
      >
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-default-400 uppercase tracking-wide">
          {label}
        </p>
        <p className={`text-sm text-default-700 truncate ${valueClassName}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function SecurityRow({
  label,
  value,
  action,
  href,
  last,
}: {
  label: string;
  value: string;
  action?: string;
  href?: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-3 ${
        last ? "" : "border-b border-divider"
      }`}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-default-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm text-default-700 mt-0.5 truncate">{value}</p>
      </div>
      {action && href && (
        <Link
          href={href}
          className="text-sm font-medium text-primary hover:opacity-80 transition flex-shrink-0"
        >
          {action}
        </Link>
      )}
    </div>
  );
}
