"use client";
import { IconContext } from "react-icons";
import {
  MdEventNote,
  MdEvent,
  MdOutlineLibraryMusic,
  MdLibraryMusic,
} from "react-icons/md";
import { RiTeamFill, RiTeamLine } from "react-icons/ri";
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
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { basicUserData } from "@/utils/types/userData";

export default function MenuApp({
  isLoggedIn,
  notifications,
  userdata,
}: {
  isLoggedIn: boolean;
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
          </TransitionLink>
          {isLoggedIn && (
            <TransitionLink href="/setlist" className="pwaiconsmenu">
              {parameter === "setlist" ? <MdEvent /> : <MdEventNote />}
            </TransitionLink>
          )}
          {isLoggedIn &&
            hasPermission(userdata.role as Role, "read:churchmembers") && (
              <TransitionLink href="/calendar" className="pwaiconsmenu">
                {parameter === "people" ? <FaRegCalendarAlt /> : <FaRegCalendarAlt />
}
              </TransitionLink>
            )}
          {isLoggedIn && (
            <TransitionLink href="/notifications" className="pwaiconsmenu">
              {parameter === "/notifications" ? (
                <Badge size="sm" color="primary" content={notifications}>
                  <IoNotificationsSharp />
                </Badge>
              ) : (
                <div>
                  <Badge
                    isInvisible={notifications === 0 ? true : false}
                    size="sm"
                    color="danger"
                    showOutline={false}
                    content={notifications}
                  >
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
