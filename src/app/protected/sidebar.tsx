"use client";
import { Avatar } from "@heroui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaCalendarTimes,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { IoNotificationsSharp, IoSettingsSharp } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import logoutAction from "../components/logOutAction";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function Sidebar({}: {}) {
  const router = useRouter();
  const { fetchUser, userData } = useUserStore();

  const [avatarUrl, setAvatarUrl] = useState("/images/userAvatarDefault.jpg");
  useEffect(() => {
  if (userData?.id) {
    setAvatarUrl(
      `https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/avatars/${userData.id}/avatar.jpg`
    );
  }
}, [userData?.id]);
  async function logouter() {
    await logoutAction();
    await fetchUser();
    router.push("/protected/dashboard/account");
  }

  return (
    <div className="hidden md:block sidebar-container">
      <div className="text-center">
        <Avatar
          as="button"
          size="lg"
          className="transition-transform mt-10 mb-5"
          src={avatarUrl}
          onError={() => {
            setAvatarUrl("/images/userAvatarDefault.jpg"); // your default image path
          }}
        />
        {userData.name && (
          <>
            <h6 className="font-bold">
              {userData.name + " " + userData.lastname}
            </h6>
            <p>{userData.email}</p>
          </>
        )}
      </div>
      <ul className="sidebar-ul">
        <li>
          <Link className="sidebar-link" href="/protected/dashboard/account">
            <FaUserCircle className="dashboard-icon" />
            Account
          </Link>
        </li>
        {userData.church_id && (
          <>
            <li>
              <Link className="sidebar-link" href="/protected/calendar">
                <FaRegCalendarAlt />
                Calendario
              </Link>
            </li>
            <li>
              <Link className="sidebar-link" href="/protected/notifications">
                <IoNotificationsSharp />
                Notifiche
              </Link>
            </li>
            <li>
              <Link className="sidebar-link" href="/protected/blockouts">
                <FaCalendarTimes className="dashboard-icon" />
                Blocca Date
              </Link>
            </li>
            <li>
              <Link className="sidebar-link" href="/protected/teams">
                <HiUserGroup className="dashboard-icon" />
                Team
              </Link>
            </li>
          </>
        )}

        <li>
          <Link className="sidebar-link" href="/protected/dashboard/account">
            <IoSettingsSharp className="dashboard-icon" />
            Impostazioni
          </Link>
        </li>

        <li>
          <button className="sidebar-link logoutcolors" onClick={logouter}>
            <MdOutlineLogout />
            Esci
          </button>
        </li>
      </ul>
    </div>
  );
}
