"use client";
import { Avatar } from "@heroui/react";
import Link from "next/link";
import { Dispatch, useEffect, useState } from "react";
import {
  FaUserCircle,
  FaCalendarTimes,
  FaRegCalendarAlt,
  FaChevronDown,
  FaRegCompass,
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
import { FaCompass } from "react-icons/fa6";

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
              <div className="sidebar-link !justify-between">
                {userData.name + " " + userData.lastname}
                <FaChevronDown className="dashboard-icon !mr-0" />
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
        <li className="sidebar-li !mt-6 border-b-1 ">
          <span className="sidebar-link">
            <div className="sidebar-element sidebar-title">Area personale</div>
          </span>
        </li>

        <li className="sidebar-li">
          <Link className="sidebar-link" href="/protected/dashboard/account">
            <div className="sidebar-element">
              <FaUserCircle className="dashboard-icon" />
              Account
            </div>
          </Link>
        </li>
        {userData.church_id && (
          <li className="sidebar-li">
            <Link className="sidebar-link" href="/protected/blockouts">
              <div className="sidebar-element">
                <FaCalendarTimes className="dashboard-icon" />
                Blocca Date{" "}
              </div>
            </Link>
          </li>
        )}
        <li className="sidebar-li">
          <Link className="sidebar-link" href="/protected/notifications">
            {" "}
            <div className="sidebar-element">
              <IoNotificationsSharp />
              Notifiche{" "}
            </div>
          </Link>
        </li>
        <li className="sidebar-li">
          <Link className="sidebar-link" href="/">
            <div className="sidebar-element">
              <FaCompass />
              Esplora
            </div>
          </Link>
        </li>
        {userData.church_id && (
          <li className="sidebar-li !mt-6 border-b-1 ">
            <span className="sidebar-link">
              <div className="sidebar-element sidebar-title">La mia Chiesa</div>
            </span>
          </li>
        )}
        {userData.church_id && (
          <>
            {(hasPermission(userData.role as Role, "create:setlists") ||
              TeamLeader) && (
              <li className="sidebar-li">
                <Link className="sidebar-link" href="/protected/church">
                  <div className="sidebar-element">
                    <BiChurch />
                    Chiesa
                  </div>
                </Link>
              </li>
            )}
            <li className="sidebar-li">
              <Link className="sidebar-link" href="/protected/events">
                {" "}
                <div className="sidebar-element">
                  <MdOutlineEventNote />
                  Eventi
                </div>
              </Link>
            </li>
            <li className="sidebar-li">
              <Link className="sidebar-link" href="/protected/churchsongs">
                {" "}
                <div className="sidebar-element">
                  <BsMusicNoteList />
                  Canzoni
                </div>
              </Link>
            </li>

            <li className="sidebar-li">
              <Link className="sidebar-link" href="/protected/calendar">
                {" "}
                <div className="sidebar-element">
                  <FaRegCalendarAlt />
                  Calendario
                </div>
              </Link>
            </li>

            <li className="sidebar-li">
              <Link className="sidebar-link" href="/protected/teams">
                <div className="sidebar-element">
                  <HiUserGroup className="dashboard-icon" />
                  Team{" "}
                </div>
              </Link>
            </li>
          </>
        )}

        <li className="sidebar-li !mt-6 border-b-1 "></li>
        <li className="sidebar-li">
          <button
            className="sidebar-link !justify-center logoutcolors"
            onClick={logouter}
          >
            <MdOutlineLogout />
            Esci
          </button>
        </li>
      </ul>
    </>
  );
}
