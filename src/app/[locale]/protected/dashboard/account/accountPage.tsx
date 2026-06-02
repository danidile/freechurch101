"use client";

import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { updateAccountAction } from "./updateAccountAction";
import { GrCircleAlert } from "react-icons/gr";
import {
  FaAsterisk,
  FaCheck,
  FaPlus,
  FaRegQuestionCircle,
} from "react-icons/fa";
import React from "react";
import { IconType } from "react-icons";
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

import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { Spinner } from "@heroui/spinner";
import { Link } from "@/i18n/navigation";
import { Button } from "@heroui/button";
import { MdFamilyRestroom } from "react-icons/md";
import NotificationPage from "@/app/[locale]/notifications/page";
import { HeaderCL } from "@/app/[locale]/components/header-comp";
import TeamsPageComponent from "../../teams/TeamsPageComponent";
import BlockDatesComponent from "../../blockouts/blockDatesComponent";
import PersonalizeChurchComponent from "../../church/personalize/page";
import TicketSystem from "../../tickets/page";
import LogsPage from "@/app/[locale]/admin/logs/page";
import FamilyPage from "../family/page";

type Section =
  | "personal"
  | "family"
  | "church"
  | "security"
  | "notifications"
  | "blockouts"
  | "personalize"
  | "tickets"
  | "logs"
  | "teams";

export default function AccountPage() {
  const { userData, loading, fetchUser } = useUserStore();
  console.log("AccountPage userData:", userData); // ✅ Log userData to verify it's being fetched correctly
  const currentDate = new Date();
  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() - 1);

  const [activeSection, setActiveSection] = useState<Section>("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: userData?.name || "",
    lastname: userData?.lastname || "",
    phone: userData?.phone || "",
    email: userData?.email || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await updateAccountAction(form);
      if (res.success) {
        setSuccess(true);
        setIsEditing(false);
        await fetchUser();
      } else {
        setError(res.error || "Errore durante il salvataggio.");
      }
    } catch {
      setError("Errore inaspettato.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: userData?.name || "",
      lastname: userData?.lastname || "",
      phone: userData?.phone || "",
      email: userData?.email || "",
    });
    setIsEditing(false);
    setError("");
  };

  const navItems: { key: Section; label: string; icon: React.ReactNode }[] = [
    {
      key: "personal",
      label: "Info personali",
      icon: <LuUser size={16} />,
    },
    { key: "family", label: "Famiglia", icon: <MdFamilyRestroom size={16} /> },
    { key: "notifications", label: "Notifiche", icon: <LuInbox size={16} /> },
    { key: "teams", label: "Teams", icon: <FaAsterisk size={16} /> },
    {
      key: "blockouts",
      label: "Blocca Date",
      icon: <LuCalendarOff size={16} />,
    },
    {
      key: "personalize",
      label: "Personalizza Chiesa",
      icon: <LuChurch size={16} />,
    },
    { key: "security", label: "Sicurezza", icon: <LuShield size={16} /> },
    { key: "logs", label: "Logs", icon: <LuLogs size={16} /> },
    {
      key: "tickets",
      label: "Support Tickets",
      icon: <FaRegQuestionCircle size={16} />,
    },
  ];
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

  if (loading || !userData)
    return (
      <div className="container-sub">
        <Spinner size="lg" />
      </div>
    );
  return (
    <div className="w-full mx-auto px-4 p-2 sm:p-12">
      {/* Header */}
      <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100">
        <div className="relative">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="Avatar"
              className="rounded-full object-cover w-[72px] h-[72px]"
            />
          ) : (
            <div className="w-[72px] h-[72px] rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-semibold">
              {initials || "?"}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {userData?.name} {userData?.lastname}
          </h1>
          <p className="text-sm text-gray-500">{userData?.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
              {userData?.role || "Membro"}
            </span>
            {userData?.church_name && (
              <span className="text-xs text-gray-400">
                · {userData.church_name}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar nav */}
        <aside className="md:w-52 flex-shrink-0 bg-gray-50 rounded-xl p-1 overflow-hidden">
          {/* Mobile: horizontal scrollable pills */}
          <nav className="flex md:hidden gap-1 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 bg-gra">
            {navItems.map((item) => {
              if (
                item.key === "logs" &&
                userData?.email !== "danidile94@gmail.com"
              )
                return null;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveSection(item.key);
                    setIsEditing(false);
                    setError("");
                    setSuccess(false);
                  }}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium flex-shrink-0 transition-colors ${
                    activeSection === item.key
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  {item.icon}
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop: vertical sidebar */}
          <nav className="hidden md:flex flex-col gap-1">
            {navItems.map((item) => {
              if (
                item.key === "logs" &&
                userData?.email !== "danidile94@gmail.com"
              )
                return null;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveSection(item.key);
                    setIsEditing(false);
                    setError("");
                    setSuccess(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                    activeSection === item.key
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* ── PERSONAL ── */}
          {activeSection === "personal" && (
            <SectionCard
              title="Informazioni personali"
              isEditing={isEditing}
              saving={saving}
              onEdit={() => setIsEditing(true)}
              onSave={handleSave}
              onCancel={handleCancel}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                    Nome:
                  </label>

                  <div className="flex items-center gap-2 text-sm text-gray-800 py-1.5">
                    <span className="text-gray-400">
                      <LuUser size={14} />
                    </span>
                    <span>
                      {}
                      {userData.name} {userData.lastname}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                    Cognome:
                  </label>

                  <div className="flex items-center gap-2 text-sm text-gray-800 py-1.5">
                    <span className="text-gray-400">
                      <LuUser size={14} />
                    </span>
                    <span>
                      {}
                      {userData.lastname}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                    Email:
                  </label>

                  <div className="flex items-center gap-2 text-sm text-gray-800 py-1.5">
                    <span className="text-gray-400">
                      <LuMail size={14} />
                    </span>
                    <span>
                      {}
                      {userData.email}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
                    Telefono:
                  </label>

                  <div className="flex items-center gap-2 text-sm text-gray-800 py-1.5">
                    <span className="text-gray-400">
                      <LuPhone size={14} />
                    </span>
                    <span>
                      {}
                      {userData.phone}
                    </span>
                  </div>
                </div>
              </div>

              {error && <ErrorBanner message={error} />}
              {success && (
                <SuccessBanner message="Profilo aggiornato con successo." />
              )}
            </SectionCard>
          )}
          {/* ── Family ── */}
          {activeSection === "family" && (
            <SectionCard
              title="Famiglia"
              description="Gestisci le informazioni relative alla tua famiglia."
              icon={MdFamilyRestroom}
            >
              <div className="w-full max-w-[1100px] mx-auto">
                {" "}
                <FamilyPage />
              </div>
            </SectionCard>
          )}
          {/* ── Notifications ── */}
          {activeSection === "notifications" && (
            <SectionCard
              title="Notifiche"
              description="Tutti gli aggiornamenti e gli avvisi che riguardano la tua attività."
              icon={LuInbox}
            >
              <NotificationPage />
              {error && <ErrorBanner message={error} />}
              {success && (
                <SuccessBanner message="Contatti aggiornati con successo." />
              )}
            </SectionCard>
          )}
          {/* ── Blockouts ── */}
          {activeSection === "blockouts" && (
            <SectionCard
              title="Blocca Date"
              description="Gestisci i periodi in cui non sarai disponibile per le turnazioni."
              icon={LuCalendarOff}
            >
              <BlockDatesComponent />
              {error && <ErrorBanner message={error} />}
              {success && (
                <SuccessBanner message="Contatti aggiornati con successo." />
              )}
            </SectionCard>
          )}

          {/* ── Blockouts ── */}
          {activeSection === "personalize" && (
            <SectionCard
              title="Personalizza Chiesa"
              description="Gestisci i periodi in cui non sarai disponibile per le turnazioni."
              icon={LuChurch}
            >
              <PersonalizeChurchComponent />
              {error && <ErrorBanner message={error} />}
              {success && (
                <SuccessBanner message="Contatti aggiornati con successo." />
              )}
            </SectionCard>
          )}
          {activeSection === "teams" && (
            <SectionCard
              title="Teams"
              description="Tutti gli aggiornamenti e gli avvisi che riguardano la tua attività."
              icon={FaAsterisk}
            >
              {hasPermission(userData.role as Role, "create:team") && (
                <Link href="/protected/teams/create-team">
                  <Button size="sm" className="gap-2">
                    <FaPlus />
                    Crea nuovo team
                  </Button>
                </Link>
              )}
              <TeamsPageComponent />
              {error && <ErrorBanner message={error} />}
              {success && (
                <SuccessBanner message="Contatti aggiornati con successo." />
              )}
            </SectionCard>
          )}
          {/* ── CHURCH ── */}
          {activeSection === "church" && (
            <SectionCard title="Chiesa" hideActions>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
                {churchLogoSrc ? (
                  <img
                    src={churchLogoSrc}
                    alt="Logo chiesa"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <LuChurch size={22} />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {userData?.church_name || "—"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Ruolo:{" "}
                    <span className="font-medium text-gray-600">
                      {userData?.role || "Membro"}
                    </span>
                  </p>
                </div>
                {userData?.pending_church_confirmation && (
                  <span className="ml-auto text-xs font-medium px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                    In attesa di approvazione
                  </span>
                )}
              </div>

              {userData?.teams && userData.teams.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Team
                  </p>
                  <div className="flex flex-col gap-2"></div>
                </div>
              )}
            </SectionCard>
          )}
          {/* ── SECURITY ── */}
          {activeSection === "security" && (
            <SectionCard title="Sicurezza" hideActions>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row justify-between items-center gap-3">
                  <SecurityRow
                    label="Password"
                    value="••••••••••••"
                    action="Cambia password"
                  />
                  <Link href={"/protected/reset-password"}>
                    Cambia Password
                  </Link>
                </div>
                <SecurityRow
                  label="Email di accesso"
                  value={userData?.email || "—"}
                />
              </div>
            </SectionCard>
          )}

          {/* ── Logs ── */}
          {activeSection === "logs" && (
            <SectionCard title="Logs Dashboard" icon={LuLogs}>
              <LogsPage />
              {error && <ErrorBanner message={error} />}
              {success && (
                <SuccessBanner message="Contatti aggiornati con successo." />
              )}
            </SectionCard>
          )}

          {/* ── Tickets ── */}
          {activeSection === "tickets" && (
            <SectionCard
              title="Admin Dashboard"
              description={`Benvenuto, ${userData.name}`}
              icon={FaRegQuestionCircle}
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
  icon,
  description,

  children,
}: {
  title: string;
  icon?: IconType;
  description?: string;

  children: React.ReactNode;
  isEditing?: boolean;
  saving?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  hideActions?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <HeaderCL icon={icon} title={title} description={description} />
      </div>
      {children}
    </div>
  );
}

function SecurityRow({
  label,
  value,
  action,
  href,
}: {
  label: string;
  value: string;
  action?: string;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm text-gray-700 mt-0.5">{value}</p>
      </div>
      {action && href && (
        <a
          href={href}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
        >
          {action}
        </a>
      )}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-100 mt-4">
      <GrCircleAlert size={14} />
      <p>{message}</p>
    </div>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-100 mt-4">
      <FaCheck size={12} />
      <p>{message}</p>
    </div>
  );
}
