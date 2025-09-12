"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaCalendarTimes,
  FaRegCalendarAlt,
  FaQuestion,
  FaAsterisk,
  FaRegQuestionCircle,
} from "react-icons/fa";
import {
  MdOutlineContactSupport,
  MdOutlineEventNote,
  MdOutlineExplore,
  MdOutlineLibraryMusic,
} from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa6";

import { HiUserGroup } from "react-icons/hi2";
import { IoNotificationsSharp, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import logoutAction from "../components/logOutAction";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { PiChurch, PiChurchFill, PiPasswordBold } from "react-icons/pi";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from "@heroui/react";
import isTeamLeaderClient from "@/utils/supabase/isTeamLeaderClient";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { FaCompass } from "react-icons/fa6";
import LogsComponent from "../admin/logs/LogsComponent";
import {
  LuCalendarClock,
  LuCalendarOff,
  LuCalendarRange,
  LuChurch,
  LuInbox,
  LuLayoutDashboard,
  LuLogs,
} from "react-icons/lu";
import NotificationButton from "@/components/NotificationButton";
import TestNotificationButton from "@/components/testNotificationButton";
import { BiNotification } from "react-icons/bi";

// A reusable sidebar link component for consistency
const SidebarLink = ({
  href,
  icon,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
}) => (
  <li>
    <Link
      href={href}
      className="flex gap-3 transition duration-300 items-center p-2 text-zinc-700 dark:text-zinc-300 rounded-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 group"
    >
      {icon}
      <p>{text}</p>
    </Link>
  </li>
);

// A reusable section title
const SidebarSectionTitle = ({ title }: { title: string }) => (
  <div className=" border-b mt-4 mb-2">
    <span className="sidebar-link">
      <div className="sidebar-element sidebar-title">
        <h6>{title}</h6>
      </div>
    </span>
  </div>
);

export default function Sidebar() {
  const router = useRouter();
  const { fetchUser, userData, loading } = useUserStore();

  async function logouter() {
    await logoutAction();
    await fetchUser();
    router.push("/protected/dashboard/account");
  }

  const [TeamLeader, setTeamLeader] = useState<boolean>(false);
  useEffect(() => {
    const fetchLeaderStatus = async () => {
      if (!loading && userData.loggedIn) {
        const leaderStatus = await isTeamLeaderClient();
        setTeamLeader(leaderStatus.isLeader);
      }
    };
    fetchLeaderStatus();
  }, [loading, userData]);
  const iconSize = 20;
  const navSections = {
    main: [
      {
        href: "/protected/dashboard/account",
        icon: <LuLayoutDashboard size={iconSize} />,
        text: "Dashboard",
        show: true,
      },
      {
        href: "/notifications",
        icon: <LuInbox size={iconSize} />,
        text: "Notifiche",
        show: true,
      },
      {
        href: "/protected/blockouts",
        icon: <LuCalendarOff size={iconSize} />,
        text: "Blocca Date",
        show: !!userData.church_id,
      },
      {
        href: "/artists",
        icon: <MdOutlineExplore size={iconSize} />,
        text: "Esplora",
        show: true,
      },
    ],
    church: [
      {
        href: "/setlist",
        icon: <LuCalendarRange size={iconSize} />,
        text: "Eventi",
        show: !!userData.church_id,
      },
      {
        href: "/songs",
        icon: <MdOutlineLibraryMusic size={iconSize} />,
        text: "Canzoni",
        show: !!userData.church_id,
      },
      {
        href: "/protected/teams",
        icon: <FaAsterisk size={iconSize} />,
        text: "Team",
        show: !!userData.church_id,
      },
      {
        href: "/protected/church",
        icon: <PiChurch size={iconSize} />,
        text: "Membri Chiesa",
        show:
          !!userData.church_id &&
          (hasPermission(userData.role as Role, "read:churchmembers") ||
            TeamLeader),
      },
      {
        href: "/protected/church/personalize",
        icon: <LuChurch size={iconSize} />,
        text: "Personalizza Chiesa",
        show:
          hasPermission(userData.role as Role, "personalize:church") ||
          TeamLeader,
      },
    ],
    management: [
      // {
      //   href: "/protected/blockouts-calendar",
      //   icon: <LuCalendarClock size={iconSize} />,
      //   text: "Calendario Presenze",
      //   show: userData.teams?.some((team) => team.role === "leader"),
      // },

      // {
      //   href: "/protected/church/stripe",
      //   icon: <FaRegCreditCard size={iconSize} />,
      //   text: "Abbonamento",
      //   show:
      //     hasPermission(userData.role as Role, "personalize:church") &&
      //     userData.email === "danidile94@gmail.com",
      // },
      {
        href: "/protected/tickets",
        icon: <FaRegQuestionCircle size={iconSize} />,
        text: "Support Tickets",
        show: true,
      },
    ],
    admin: [
      {
        href: "/admin/logs",
        icon: <LuLogs size={iconSize} />,
        text: "Logs",
        show: userData.email === "danidile94@gmail.com",
      },
    ],
  };
  return (
    <>
      <div className="sidebar-ul">
        {userData.church_logo && (
          <>
            <img
              className="max-w-[125px] mx-auto mb-8"
              src={`https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/churchlogo/${userData.church_logo}?t=${Date.now()}`}
              alt=""
            />
          </>
        )}
        <div className="">
          <Dropdown placement="bottom-start">
            <DropdownTrigger>
              <button className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                <User
                  name={`${userData.name} ${userData.lastname}`}
                  description={userData.email}
                  // You can use a generic avatar or a real one if you have it
                  avatarProps={{
                    src: userData.avatar_url
                      ? `https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/avatars/${userData.avatar_url}?t=${Date.now()}`
                      : "/images/userAvatarDefault.jpg",

                    fallback: (
                      <FaUserCircle className="w-6 h-6 text-zinc-500" />
                    ),
                  }}
                />
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions">
              <DropdownItem
                key="update_profile"
                as={Link}
                href="/protected/dashboard/account/completeAccount"
                startContent={<IoSettingsOutline />}
              >
                Aggiorna Profilo
              </DropdownItem>
              <DropdownItem
                key="reset_password"
                as={Link}
                href="/protected/reset-password"
                startContent={<PiPasswordBold />}
              >
                Cambia Password
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                className="text-danger"
                onClick={logouter}
                startContent={<MdOutlineLogout />}
              >
                Esci
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        {/* <li className="sidebar-li">
          <Link className="sidebar-link" href="/protected/dashboard/account">
            <div className="sidebar-element">
              <FaUserCircle className="dashboard-icon" />
              <p>Account</p>
            </div>
          </Link>
        </li>
        {userData.church_id && (
          <li className="sidebar-li">
            <Link className="sidebar-link" href="/protected/blockouts">
              <div className="sidebar-element">
                <FaCalendarTimes className="dashboard-icon" />
                <p>Blocca Date</p>
              </div>
            </Link>
          </li>
        )}
        <li className="sidebar-li">
          <Link className="sidebar-link" href="/notifications">
            <div className="sidebar-element">
              <IoNotificationsSharp />
              <p>Notifiche</p>
            </div>
          </Link>
        </li>
        {userData.church_id && (
          <>
            {(hasPermission(userData.role as Role, "read:churchmembers") ||
              TeamLeader) && (
              <li className="sidebar-li">
                <Link className="sidebar-link" href="/protected/church">
                  <div className="sidebar-element">
                    <PiChurch />

                    <p>Chiesa</p>
                  </div>
                </Link>
              </li>
            )}
            {(hasPermission(userData.role as Role, "personalize:church") ||
              TeamLeader) && (
              <li className="sidebar-li">
                <Link
                  className="sidebar-link"
                  href="/protected/church/personalize"
                >
                  <div className="sidebar-element">
                    <PiChurchFill />
                    <p> Personalizza Chiesa</p>
                  </div>
                </Link>
              </li>
            )}
            <li className="sidebar-li">
              <Link className="sidebar-link" href="/setlist">
                <div className="sidebar-element">
                  <FaRegCalendarAlt />
                  <p>Eventi</p>
                </div>
              </Link>
            </li>
            <li className="sidebar-li">
              <Link className="sidebar-link" href="/songs">
                <div className="sidebar-element">
                  <MdOutlineLibraryMusic />
                  <p>Canzoni</p>
                </div>
              </Link>
            </li>
            {userData.teams.filter((team) => team.role === "leader").length >=
              1 && (
              <li className="sidebar-li">
                <Link
                  className="sidebar-link"
                  href="/protected/blockouts-calendar"
                >
                  <div className="sidebar-element">
                    <FaRegCalendarAlt />
                    <p> Calendario Presenze</p>
                  </div>
                </Link>
              </li>
            )}

            <li className="sidebar-li">
              <Link className="sidebar-link" href="/protected/teams">
                <div className="sidebar-element">
                  <HiUserGroup className="dashboard-icon" />
                  <p>Team</p>
                </div>
              </Link>
            </li>
          </>
        )}
        {userData.email === "danidile94@gmail.com" && (
          <li className="sidebar-li">
            <Link className="sidebar-link" href="/admin/logs">
              <div className="sidebar-element">
                <LuLogs className="dashboard-icon" />
                <p>Logs</p>
              </div>
            </Link>
          </li>
        )}
        <li className="sidebar-li">
          <Link className="sidebar-link" href="/artists">
            <div className="sidebar-element">
              <FaCompass />
              <p>Esplora</p>
            </div>
          </Link>
        </li>
        <li className="sidebar-li">
          <Link className="sidebar-link" href="/protected/tickets">
            <div className="sidebar-element">
              <FaQuestion />

              <p>Ticket</p>
            </div>
          </Link>
        </li> */}
        {/* {userData.email === "danidile94@gmail.com" && <NotificationButton />}
        {userData.email === "danidile94@gmail.com" && (
          <TestNotificationButton />
        )} */}
        <nav className="flex-grow  overflow-y-auto">
          <ul className="space-y-1">
            {navSections.main
              .filter((item) => item.show)
              .map((item) => (
                <SidebarLink
                  key={item.href}
                  {...item}
                  icon={
                    item.icon && <span className="w-5 h-5">{item.icon}</span>
                  }
                />
              ))}
          </ul>

          {navSections.church.some((item) => item.show) && (
            <>
              <SidebarSectionTitle title="Chiesa" />
              <ul className="space-y-1">
                {navSections.church
                  .filter((item) => item.show)
                  .map((item) => (
                    <SidebarLink
                      key={item.href}
                      {...item}
                      icon={
                        item.icon && (
                          <span className="w-5 h-5">{item.icon}</span>
                        )
                      }
                    />
                  ))}
              </ul>
            </>
          )}

          {navSections.management.some((item) => item.show) && (
            <>
              <SidebarSectionTitle title="Gestione" />
              <ul className="space-y-1">
                {navSections.management
                  .filter((item) => item.show)
                  .map((item) => (
                    <SidebarLink
                      key={item.href}
                      {...item}
                      icon={
                        item.icon && (
                          <span className="w-5 h-5">{item.icon}</span>
                        )
                      }
                    />
                  ))}
              </ul>
            </>
          )}

          {navSections.admin.some((item) => item.show) && (
            <>
              <SidebarSectionTitle title="Admin" />
              <ul className="space-y-1">
                {navSections.admin
                  .filter((item) => item.show)
                  .map((item) => (
                    <SidebarLink
                      key={item.href}
                      {...item}
                      icon={
                        item.icon && (
                          <span className="w-5 h-5">{item.icon}</span>
                        )
                      }
                    />
                  ))}
              </ul>
            </>
          )}
        </nav>{" "}
        <div className="sidebar-li">
          <button
            className="sidebar-link justify-center! logoutcolors"
            onClick={logouter}
          >
            <MdOutlineLogout />
            Esci
          </button>
        </div>
      </div>
    </>
  );
}
