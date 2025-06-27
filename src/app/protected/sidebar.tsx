"use client";
import { Avatar } from "@heroui/react";
import Link from "next/link";
import { Dispatch, useEffect, useState } from "react";
import {
  FaUserCircle,
  FaCalendarTimes,
  FaRegCalendarAlt,
  FaChevronDown,
} from "react-icons/fa";
import { BsMusicNoteList } from "react-icons/bs";
import { MdOutlineEventNote } from "react-icons/md";

import { HiUserGroup } from "react-icons/hi2";
import { IoNotificationsSharp, IoSettingsSharp } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import logoutAction from "../components/logOutAction";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { PiPasswordBold } from "react-icons/pi";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { BiChurch } from "react-icons/bi";
import isTeamLeaderClient from "@/utils/supabase/isTeamLeaderClient";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";

export default function Sidebar() {
  const router = useRouter();
  const { fetchUser, userData, loading } = useUserStore();

  const [avatarUrl, setAvatarUrl] = useState("/images/userAvatarDefault.jpg");
  useEffect(() => {
    if (userData?.id) {
      setAvatarUrl(
        `https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/avatars/${userData.id}/avatar_thumb.jpg`
      );
    }
  }, [userData?.id]);
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
  return (
    <>
      <ul className="sidebar-ul">
        <Dropdown placement="bottom">
          <DropdownTrigger>
            <li className="sidebar-li">
              <div className="sidebar-link">
                <div className="flex flex-row justify-start items-center w-full max-w-[180px] truncate text-gray-600  gap-5">
                  {userData.name + " " + userData.lastname}
                  <FaChevronDown className="dashboard-icon" />
                </div>
              </div>
            </li>
          </DropdownTrigger>
          <DropdownMenu aria-label="Static Actions">
            <DropdownItem
              key="updateaccount"
              as={Link}
              href="/protected/dashboard/account/completeAccount"
              startContent={<FaUserCircle className="dashboard-icon" />}
            >
              Aggiorna profilo
            </DropdownItem>
            <DropdownItem
              key="resetpassword"
              as={Link}
              href="/protected/reset-password"
              startContent={<PiPasswordBold className="dashboard-icon" />}
            >
              Cambia Password
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <li className="sidebar-li">
          <span className="sidebar-link">
            <div className="flex px-3 flex-row browser:justify-start standalone:justify-center  w-full text-[12px]  text-gray-500  gap-5">
              Area personale
            </div>
          </span>
        </li>

        <li className="sidebar-li">
          <Link className="sidebar-link" href="/protected/dashboard/account">
            <div className="flex flex-row justify-start items-center w-full max-w-[140px] text-gray-600  gap-5">
              <FaUserCircle className="dashboard-icon" />
              Account
            </div>
          </Link>
        </li>
        {userData.church_id && (
          <li className="sidebar-li">
            <Link className="sidebar-link" href="/protected/blockouts">
              <div className="flex flex-row justify-start items-center w-full max-w-[140px]  text-gray-600  gap-5">
                <FaCalendarTimes className="dashboard-icon" />
                Blocca Date{" "}
              </div>
            </Link>
          </li>
        )}
        <li className="sidebar-li">
          <Link className="sidebar-link" href="/protected/notifications">
            {" "}
            <div className="flex flex-row justify-start items-center w-full max-w-[140px]  text-gray-600  gap-5">
              <IoNotificationsSharp />
              Notifiche{" "}
            </div>
          </Link>
        </li>
        {userData.church_id && (
          <li className="sidebar-li">
            <span className="sidebar-link">
              <div className="flex  px-3 flex-row browser:justify-start standalone:justify-center w-full text-[12px]   text-gray-500  gap-5">
                La mia Chiesa
              </div>
            </span>
          </li>
        )}
        {userData.church_id && (
          <>
            {(hasPermission(userData.role as Role, "create:setlists") ||
              TeamLeader) && (
              <li className="sidebar-li">
                <Link className="sidebar-link" href="/protected/church">
                  <div className="flex flex-row justify-start items-center w-full max-w-[140px]  text-gray-600  gap-5">
                    <BiChurch />
                    Chiesa
                  </div>
                </Link>
              </li>
            )}
            <li className="sidebar-li">
              <Link className="sidebar-link" href="/protected/events">
                {" "}
                <div className="flex flex-row justify-start items-center w-full max-w-[140px]  text-gray-600  gap-5">
                  <MdOutlineEventNote />
                  Eventi
                </div>
              </Link>
            </li>
            <li className="sidebar-li">
              <Link className="sidebar-link" href="/protected/churchsongs">
                {" "}
                <div className="flex flex-row justify-start items-center w-full max-w-[140px]  text-gray-600  gap-5">
                  <BsMusicNoteList />
                  Canzoni
                </div>
              </Link>
            </li>

            <li className="sidebar-li">
              <Link className="sidebar-link" href="/protected/calendar">
                {" "}
                <div className="flex flex-row justify-start items-center w-full max-w-[140px]  text-gray-600  gap-5">
                  <FaRegCalendarAlt />
                  Calendario
                </div>
              </Link>
            </li>

            <li className="sidebar-li">
              <Link className="sidebar-link" href="/protected/teams">
                <div className="flex flex-row justify-start items-center w-full max-w-[140px]  text-gray-600  gap-5">
                  <HiUserGroup className="dashboard-icon" />
                  Team{" "}
                </div>
              </Link>
            </li>
          </>
        )}

        <div className="w-full max-w-[75%] m-auto h-[1px]  bg-gray-300"></div>
        <li className="sidebar-li">
          <button className="sidebar-link logoutcolors" onClick={logouter}>
            <MdOutlineLogout />
            Esci
          </button>
        </li>
      </ul>
    </>
  );
}
