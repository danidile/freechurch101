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
import { FaRegCalendarAlt } from "react-icons/fa";
import { Badge } from "@heroui/badge";
import { TransitionLink } from "./TransitionLink";
import { usePathname } from "next/navigation"; // ✅ Use this for App Router
import { useState, useEffect } from "react";
import { basicUserData } from "@/utils/types/userData";
import { FaRegCompass } from "react-icons/fa";
import { BiCompass, BiSolidCompass } from "react-icons/bi";
import { LuBell, LuBellRing } from "react-icons/lu";

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
    <div className="appmenucontainer browser:!hidden">
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
              {parameter === "setlist" ? <MdEvent /> : <MdEventNote />}
              <small>Eventi</small>
            </TransitionLink>
          )}

          {userdata.loggedIn && (
            <>
              <TransitionLink href="/calendar" className="pwaiconsmenu">
                {parameter === "calendar" ? (
                  <FaRegCalendarAlt />
                ) : (
                  <FaRegCalendarAlt />
                )}
                <small>Calendario</small>
              </TransitionLink>
              <TransitionLink href="/notifications" className="pwaiconsmenu">
                {notifications >= 1 ? (
                  <Badge size="sm" color="primary" content={notifications}>
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
