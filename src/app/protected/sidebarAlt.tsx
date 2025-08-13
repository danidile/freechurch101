"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaCalendarTimes,
  FaRegCalendarAlt,
  FaQuestion,
  FaCompass,
} from "react-icons/fa";
import { MdOutlineLibraryMusic, MdOutlineLogout } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi2";
import { IoNotificationsSharp, IoSettingsOutline } from "react-icons/io5";
import logoutAction from "../components/logOutAction";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { PiChurch, PiChurchFill, PiPasswordBold } from "react-icons/pi";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User } from "@heroui/react"; // Assuming User component exists or can be created
import isTeamLeaderClient from "@/utils/supabase/isTeamLeaderClient";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { LuLogs } from "react-icons/lu";

// A reusable sidebar link component for consistency
const SidebarLink = ({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) => (
  <li>
    <Link
      href={href}
      className="flex items-center p-2 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 group"
    >
      {icon}
      <span className="ms-3">{text}</span>
    </Link>
  </li>
);

// A reusable section title
const SidebarSectionTitle = ({ title }: { title: string }) => (
  <h6 className="px-2 pt-4 pb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
    {title}
  </h6>
);

export default function SidebarAlt() {
  const router = useRouter();
  const { fetchUser, userData, loading } = useUserStore();
  const [isTeamLeader, setIsTeamLeader] = useState<boolean>(false);

  useEffect(() => {
    const fetchLeaderStatus = async () => {
      if (!loading && userData.loggedIn) {
        const { isLeader } = await isTeamLeaderClient();
        setIsTeamLeader(isLeader);
      }
    };
    fetchLeaderStatus();
  }, [loading, userData]);


  // Group your navigation items into logical sections
  const navSections = {
    main: [
      { href: "/protected/dashboard/account", icon: <FaUserCircle />, text: "Dashboard", show: true },
      { href: "/notifications", icon: <IoNotificationsSharp />, text: "Notifiche", show: true },
      { href: "/protected/blockouts", icon: <FaCalendarTimes />, text: "Blocca Date", show: !!userData.church_id },
      { href: "/artists", icon: <FaCompass />, text: "Esplora", show: true },
    ],
    church: [
      { href: "/setlist", icon: <FaRegCalendarAlt />, text: "Eventi", show: !!userData.church_id },
      { href: "/songs", icon: <MdOutlineLibraryMusic />, text: "Canzoni", show: !!userData.church_id },
      { href: "/protected/teams", icon: <HiUserGroup />, text: "Team", show: !!userData.church_id },
      { href: "/protected/church", icon: <PiChurch />, text: "Membri Chiesa", show: !!userData.church_id && (hasPermission(userData.role as Role, "read:churchmembers") || isTeamLeader) },
    ],
    management: [
      { href: "/protected/blockouts-calendar", icon: <FaRegCalendarAlt />, text: "Calendario Presenze", show: userData.teams?.some(team => team.role === "leader") },
      { href: "/protected/church/personalize", icon: <PiChurchFill />, text: "Personalizza Chiesa", show: hasPermission(userData.role as Role, "personalize:church") || isTeamLeader },
      { href: "/protected/tickets", icon: <FaQuestion />, text: "Support Tickets", show: true },
    ],
    admin: [
        { href: "/admin/logs", icon: <LuLogs />, text: "Logs", show: userData.email === "danidile94@gmail.com" },
    ]
  };

  return (
    <aside className="h-full w-64 flex-shrink-0 bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 flex flex-col">
        {/* Logo and User Menu Section */}
       
        <nav className="flex-grow p-4 overflow-y-auto">
            <ul className="space-y-1">
                {navSections.main.filter(item => item.show).map(item => (
                    <SidebarLink key={item.href} {...item} icon={item.icon && <span className="w-5 h-5">{item.icon}</span>}/>
                ))}
            </ul>
            
            {(navSections.church.some(item => item.show)) && (
                <>
                    <SidebarSectionTitle title="Chiesa" />
                    <ul className="space-y-1">
                        {navSections.church.filter(item => item.show).map(item => (
                            <SidebarLink key={item.href} {...item} icon={item.icon && <span className="w-5 h-5">{item.icon}</span>}/>
                        ))}
                    </ul>
                </>
            )}

             {(navSections.management.some(item => item.show)) && (
                <>
                    <SidebarSectionTitle title="Gestione" />
                    <ul className="space-y-1">
                         {navSections.management.filter(item => item.show).map(item => (
                            <SidebarLink key={item.href} {...item} icon={item.icon && <span className="w-5 h-5">{item.icon}</span>}/>
                        ))}
                    </ul>
                </>
            )}

            {(navSections.admin.some(item => item.show)) && (
                <>
                    <SidebarSectionTitle title="Admin" />
                    <ul className="space-y-1">
                        {navSections.admin.filter(item => item.show).map(item => (
                            <SidebarLink key={item.href} {...item} icon={item.icon && <span className="w-5 h-5">{item.icon}</span>}/>
                        ))}
                    </ul>
                </>
            )}
        </nav>
    </aside>
  );
}