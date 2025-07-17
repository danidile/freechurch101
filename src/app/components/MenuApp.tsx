"use client";
import { IconContext } from "react-icons";
import {
  MdEventNote,
  MdEvent,
  MdOutlineLibraryMusic,
  MdLibraryMusic,
} from "react-icons/md";
import {
  IoSettings,
  IoSettingsOutline,
  IoNotificationsOutline,
  IoNotificationsSharp,
} from "react-icons/io5";
import { FaRegCalendar, FaRegCalendarAlt } from "react-icons/fa";
import { Badge } from "@heroui/badge";
import { TransitionLink } from "./TransitionLink";
import { usePathname } from "next/navigation"; // ✅ Use this for App Router
import { useState, useEffect } from "react";
import { basicUserData } from "@/utils/types/userData";
import { BiCompass, BiSolidCompass } from "react-icons/bi";
import { LuBell, LuBellRing } from "react-icons/lu";

import { FaRegCalendarDays } from "react-icons/fa6";

export default function MenuApp({
  notifications,
  userdata,
}: {
  userdata: basicUserData;
  notifications: number;
}) {
  const pathname = usePathname(); // Get the full pathname
  const [parameter, setParameter] = useState(pathname.split("/")[1] || ""); // Initialize state based on the pathname

  useEffect(() => {
    // Update the parameter state when the pathname changes
    const pathSegments = pathname.split("/").filter(Boolean);
    setParameter(pathSegments[0] || "");
  }, [pathname]); // Depend on pathname to re-run when it changes

  return (
    <div className="block md:hidden">
      <IconContext.Provider
        value={{ size: "1.2rem", className: "app-menu-icons" }}
      >
        <div className="app-menu">
          <TransitionLink href="/songs" className="pwaiconsmenu">
            {parameter === "songs" ? (
              <MdLibraryMusic />
            ) : (
              <MdOutlineLibraryMusic />
            )}
            <small>Canzoni</small>
          </TransitionLink>
          {userdata.loggedIn && (
            <TransitionLink href="/setlist" className="pwaiconsmenu">
              {parameter === "setlist" ? (
                <FaRegCalendarDays />
              ) : (
                <FaRegCalendarAlt />
              )}
              <small>Eventi</small>
            </TransitionLink>
          )}

          {userdata.loggedIn && (
            <>
              <TransitionLink href="/notifications" className="pwaiconsmenu">
                {notifications >= 1 ? (
                  <Badge size="sm" color="danger" content={notifications}>
                    <LuBellRing />
                  </Badge>
                ) : (
                  <>
                    <Badge
                      isInvisible={notifications === 0 ? true : false}
                      size="sm"
                      color="danger"
                      showOutline={false}
                      content={notifications}
                    >
                      <LuBell />
                    </Badge>
                  </>
                )}
                <small>Notifiche</small>
              </TransitionLink>
            </>
          )}
          {!userdata.loggedIn && (
            <>
              <TransitionLink href="/" className="pwaiconsmenu">
                {parameter === "" ? <BiSolidCompass /> : <BiCompass />}
                <small>Esplora</small>
              </TransitionLink>
            </>
          )}
          <TransitionLink href="/protected/dashboard" className="pwaiconsmenu">
            {parameter === "protected" ? <IoSettings /> : <IoSettingsOutline />}
            <small>Account</small>
          </TransitionLink>
        </div>
      </IconContext.Provider>
    </div>
  );
}
