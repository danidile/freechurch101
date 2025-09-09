"use client";
import { IconContext } from "react-icons";
import { MdOutlineLibraryMusic } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { TransitionLink } from "./TransitionLink";
import { usePathname } from "next/navigation"; // ✅ Use this for App Router
import { useState, useEffect } from "react";
import { basicUserData } from "@/utils/types/userData";
import { BiCompass } from "react-icons/bi";
import { LuCalendarRange, LuInbox } from "react-icons/lu";

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
          {userdata.loggedIn && (
            <>
              <TransitionLink href="/songs" className="pwaiconsmenu">
                <MdOutlineLibraryMusic
                  color={parameter === "songs" ? "black" : "#888888"}
                />

                <small
                  className={
                    parameter === "songs" ? "text-black" : "text-gray-500"
                  }
                >
                  Canzoni
                </small>
              </TransitionLink>
            </>
          )}

          {!userdata.loggedIn && (
            <>
              <TransitionLink href="/italiansongs" className="pwaiconsmenu">
                <MdOutlineLibraryMusic
                  color={parameter === "italiansongs" ? "black" : "#888888"}
                />

                <small
                  className={
                    parameter === "italiansongs"
                      ? "text-black"
                      : "text-gray-500"
                  }
                >
                  Canzoni
                </small>
              </TransitionLink>
            </>
          )}
          {userdata.loggedIn && (
            <TransitionLink href="/setlist" className="pwaiconsmenu">
              <LuCalendarRange
                color={parameter === "setlist" ? "black" : "#888888"}
              />

              <small
                className={
                  parameter === "setlist" ? "text-black" : "text-gray-500"
                }
              >
                Eventi
              </small>
            </TransitionLink>
          )}

          {userdata.loggedIn && (
            <>
              <TransitionLink href="/notifications" className="pwaiconsmenu">
                <LuInbox
                  color={parameter === "notifications" ? "black" : "#888888"}
                />

                <small
                  className={
                    parameter === "notifications"
                      ? "text-black"
                      : "text-gray-500"
                  }
                >
                  Notifiche
                </small>
              </TransitionLink>
            </>
          )}
          {!userdata.loggedIn && (
            <>
              <TransitionLink href="/" className="pwaiconsmenu">
                <BiCompass color={parameter === "" ? "black" : "#888888"} />
                <small
                  className={parameter === "" ? "text-black" : "text-gray-500"}
                >
                  Esplora
                </small>
              </TransitionLink>
            </>
          )}
          <TransitionLink href="/protected/dashboard" className="pwaiconsmenu">
            <IoSettingsOutline
              color={parameter === "protected" ? "black" : "#888888"}
            />
            <small
              className={
                parameter === "protected" ? "text-black" : "text-gray-500"
              }
            >
              Account
            </small>
          </TransitionLink>
        </div>
      </IconContext.Provider>
    </div>
  );
}
