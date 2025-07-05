"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  Image,
} from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import UserDataMenu from "./userDataMenu";
import MenuApp from "./MenuApp";
import { useUserStore } from "@/store/useUserStore";
import { hasPermission, Role } from "@/utils/supabase/hasPermission";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
export default function MenuBarComponentSecondary({
  notifications,
}: {
  notifications: number;
}) {
  const { userData } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        className="standalone:!hidden  h-[75px] bg-[#f8f8f7]"
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Link href={"/"}>
              <Image
                className="max-h-8 overflow-visible"
                src="/images/brand/LOGO_.png"
                alt=""
              />
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {!userData ||
            (!userData.loggedIn && (
              <>
                <NavbarItem>
                  <Link color="foreground" href="/">
                    Home
                  </Link>
                </NavbarItem>
                <NavbarItem>
                  <Link color="foreground" href="/app">
                    App
                  </Link>
                </NavbarItem>
                <NavbarItem>
                  <Link color="foreground" href="/artists">
                    Artisti
                  </Link>
                </NavbarItem>
                <NavbarItem>
                  <Link color="foreground" href="/esplora">
                    Esplora
                  </Link>
                </NavbarItem>
                <NavbarItem>
                  <Link color="foreground" href="/italiansongs">
                    Canzoni
                  </Link>
                </NavbarItem>
              </>
            ))}

          {userData && userData.loggedIn && userData.church_id && (
            <>
              <NavbarItem>
                <Link color="foreground" href="/songs">
                  Canzoni
                </Link>
              </NavbarItem>
              <NavbarItem isActive>
                <Link aria-current="page" href="/setlist">
                  Eventi
                </Link>
              </NavbarItem>
              {hasPermission(userData.role as Role, "view:churchmembers") && (
                <NavbarItem>
                  <Link color="foreground" href="/people">
                    People
                  </Link>
                </NavbarItem>
              )}
              <NavbarItem>
                <Link color="foreground" href="/calendar">
                  Calendario
                </Link>
              </NavbarItem>
            
            </>
          )}
        </NavbarContent>
        <UserDataMenu userData={userData} />

        {/* // Mobile Menu */}
        <NavbarMenu>
          <NavbarItem>
            <Link
              onClick={() => setIsMenuOpen(false)}
              color="foreground"
              href="/songs"
            >
              Canzoni
            </Link>
          </NavbarItem>
          {userData.loggedIn && (
            <>
              <NavbarItem isActive>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  aria-current="page"
                  href="/setlist"
                >
                  Eventi
                </Link>
              </NavbarItem>
              <NavbarItem isActive>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  aria-current="page"
                  href="/people"
                >
                  Persone
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link
                  onClick={() => setIsMenuOpen(false)}
                  color="foreground"
                  href="/calendar"
                >
                  Calendario
                </Link>
              </NavbarItem>
            </>
          )}

          {!userData ||
            (!userData.loggedIn && (
              <>
                <NavbarItem>
                  <Link href="/login">Accedi</Link>
                </NavbarItem>
              </>
            ))}
        </NavbarMenu>
      </Navbar>

      <MenuApp userdata={userData || null} notifications={notifications} />
    </>
  );
}
