"use client";
import { IconContext } from "react-icons";
import {
  MdEventNote,
  MdEvent,
  MdOutlineLibraryMusic,
  MdLibraryMusic,
} from "react-icons/md";
import {
  RiHome5Fill,
  RiHome5Line,
  RiTeamFill,
  RiTeamLine,
} from "react-icons/ri";
import {
  IoSettings,
  IoSettingsOutline,
  IoNotificationsOutline,
  IoNotificationsSharp,
} from "react-icons/io5";
import { Badge } from "@heroui/badge";
import { TransitionLink } from "./TransitionLink";
import { usePathname } from "next/navigation"; // ✅ Use this for App Router
import { useState, useEffect } from "react";
import { notificationT } from "@/utils/types/types";

export default function MenuApp({
  isLoggedIn,
  notifications,
}: {
  isLoggedIn: boolean;
  notifications: notificationT[];
}) {
  const pathname = usePathname(); // Get the full pathname
  const [parameter, setParameter] = useState(pathname.split("/")[1] || ""); // Initialize state based on the pathname

  useEffect(() => {
    // Update the parameter state when the pathname changes
    const pathSegments = pathname.split("/").filter(Boolean);
    setParameter(pathSegments[0] || "");
  }, [pathname]); // Depend on pathname to re-run when it changes

  return (
    <div className="appmenucontainer standalone:block">
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
          </TransitionLink>
          {isLoggedIn && (
            <TransitionLink href="/setlist" className="pwaiconsmenu">
              {parameter === "setlist" ? <MdEvent /> : <MdEventNote />}
            </TransitionLink>
          )}
          {isLoggedIn && (
            <TransitionLink href="/people" className="pwaiconsmenu">
              {parameter === "people" ? <RiTeamFill /> : <RiTeamLine />}
            </TransitionLink>
          )}
          {isLoggedIn && (
            <TransitionLink
              href="/protected/notifications"
              className="pwaiconsmenu"
            >
              {parameter === "/protected/notifications" ? (
                  <Badge size="sm" color="primary" content={notifications.length}>
                    <IoNotificationsSharp />
                  </Badge>
              ) : (
                <div>
                  <Badge size="sm" color="primary" content={notifications.length}>
                    <IoNotificationsOutline />
                  </Badge>
                </div>
              )}
            </TransitionLink>
          )}
          <TransitionLink href="/protected/dashboard" className="pwaiconsmenu">
            {parameter === "protected" ? <IoSettings /> : <IoSettingsOutline />}
          </TransitionLink>
        </div>
      </IconContext.Provider>
    </div>
  );
}
function usestate(): { parameter: any; setParameter: any } {
  throw new Error("Function not implemented.");
}
