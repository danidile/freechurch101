"use client";
import Link from "next/link";
import {useEffect, useState } from "react";
import {
  FaUserCircle,
  FaCalendarTimes,
  FaRegCalendarAlt,

} from "react-icons/fa";
import {
  MdOutlineEventNote,
  MdOutlineLibraryMusic,
} from "react-icons/md";

import { HiUserGroup } from "react-icons/hi2";
import {
  IoNotificationsSharp,

} from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import logoutAction from "../components/logOutAction";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import {
  PiChurch,
  PiChurchFill,
  PiPasswordBold,
} from "react-icons/pi";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
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
        {userData.church_logo && (
          <>
            <img
              className="max-w-[125px] mx-auto mb-8"
              src={`https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/churchlogo/${userData.church_logo}`}
              alt=""
            />
          </>
        )}
        <li className="">
          <div className="sidebar-link my-5">
            <h4 className="font-normal text-center ">
              {userData.name + " " + userData.lastname}
            </h4>
          </div>
        </li>
        <li className=" !mt-6 border-b-1 ">
          <span className="sidebar-link">
            <div className="sidebar-element sidebar-title">
              <h6>Area personale</h6>
            </div>
          </span>
        </li>
        <li className=" border-b-1 ">
          <Dropdown placement="bottom">
            <DropdownTrigger>
              <span className="">
                <div className="sidebar-element sidebar-title !justify-between"></div>
              </span>
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
        </li>

        <li className="sidebar-li">
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
        <li className="sidebar-li">
          <Link className="sidebar-link" href="/artists">
            <div className="sidebar-element">
              <FaCompass />
              <p>Esplora</p>
            </div>
          </Link>
        </li>
        {userData.church_id && (
          <li className=" !mt-6 border-b-1 ">
            <span className="sidebar-link">
              <div className="sidebar-element sidebar-title">
                <h6>La mia Chiesa</h6>
              </div>
            </span>
          </li>
        )}
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
            {(hasPermission(userData.role as Role, "update:churchdetails") ||
              TeamLeader) && (
              <>
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
              </>
            )}
            <li className="sidebar-li">
              <Link className="sidebar-link" href="/songs">
                <div className="sidebar-element">
                  <MdOutlineLibraryMusic />
                  <p>Canzoni</p>
                </div>
              </Link>
            </li>
            <li className="sidebar-li">
              <Link className="sidebar-link" href="/setlist">
                <div className="sidebar-element">
                  <MdOutlineEventNote />
                  <p>Eventi</p>
                </div>
              </Link>
            </li>

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
