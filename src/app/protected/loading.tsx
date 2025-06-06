"use client";
import { basicUserData } from "@/utils/types/userData";
import { Avatar, Skeleton } from "@heroui/react";
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
import logoutAction from "../components/logOutAction";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function LoadingSidebar() {
  return (
    <div className="hidden md:block sidebar-container">
      <div className="flex flex-col justify-center items-center gap-2">
        <Avatar
          as="button"
          size="lg"
          className="transition-transform mt-10 mb-5"
          src={"/images/userAvatarDefault.jpg"}
        />
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-2/5 rounded-lg">
          <div className="h-3 w-2/5 rounded-lg bg-default-300" />
        </Skeleton>
      </div>
      <ul className="sidebar-ul">
        <li>
          <Link className="sidebar-link" href="/protected/dashboard/account">
            <Skeleton className="flex rounded-full w-4 h-4" />
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300" />
            </Skeleton>
          </Link>
        </li>
        <li>
          <Link className="sidebar-link" href="/protected/dashboard/account">
            <Skeleton className="flex rounded-full w-4 h-4" />
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300" />
            </Skeleton>
          </Link>
        </li>

        <li>
          <Link className="sidebar-link" href="/protected/dashboard/account">
            <Skeleton className="flex rounded-full w-4 h-4" />
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300" />
            </Skeleton>
          </Link>
        </li>

        <li>
          <button className="sidebar-link logoutcolors">
            <Skeleton className="flex rounded-full w-4 h-4" />
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300" />
            </Skeleton>
          </button>
        </li> <li>
          <button className="sidebar-link logoutcolors">
            <Skeleton className="flex rounded-full w-4 h-4" />
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300" />
            </Skeleton>
          </button>
        </li> <li>
          <button className="sidebar-link logoutcolors">
            <Skeleton className="flex rounded-full w-4 h-4" />
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-2/5 rounded-lg bg-default-300" />
            </Skeleton>
          </button>
        </li>
      </ul>
    </div>
  );
}
