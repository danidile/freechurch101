"use client";
import { basicUserData } from "@/utils/types/userData";
import { Avatar } from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import {
  FaUserCircle,
  FaCalendarTimes,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { IoNotificationsSharp, IoSettingsSharp } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";

export default function Sidebar({ userData }: { userData: basicUserData }) {
  const [avatarUrl, setAvatarUrl] = useState(
    `https://kadorwmjhklzakafowpu.supabase.co/storage/v1/object/public/avatars/${userData.id}/avatar.jpg`
  );
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
        <h6 className="font-bold">{userData.name + " " + userData.lastname}</h6>
        <p>{userData.email}</p>
      </div>
      <ul className="sidebar-ul">
        <li>
          <Link
            className="sidebar-link"
            prefetch
            href="/protected/dashboard/account"
          >
            <FaUserCircle className="dashboard-icon" />
            Account
          </Link>
        </li>
        <li>
          <Link className="sidebar-link" prefetch href="/protected/calendar">
            <FaRegCalendarAlt />
            Calendario
          </Link>
        </li>
        <li>
          <Link
            className="sidebar-link"
            prefetch
            href="/protected/notifications"
          >
            <IoNotificationsSharp />
            Notifiche
          </Link>
        </li>
        <li>
          <Link className="sidebar-link" prefetch href="/protected/blockouts">
            <FaCalendarTimes className="dashboard-icon" />
            Blocca Date
          </Link>
        </li>
        <li>
          <Link className="sidebar-link" prefetch href="/protected/teams">
            <HiUserGroup className="dashboard-icon" />
            Team
          </Link>
        </li>
        <li>
          <Link
            className="sidebar-link"
            prefetch
            href="/protected/dashboard/account"
          >
            <IoSettingsSharp className="dashboard-icon" />
            Impostazioni
          </Link>
        </li>

        <li>
          <Link
            className="sidebar-link"
            prefetch
            href="/protected/dashboard/account"
          >
            <MdOutlineLogout />
            Esci
          </Link>
        </li>
      </ul>
    </div>
  );
}
