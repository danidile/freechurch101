"use client";
import { basicUserData } from "@/utils/types/userData";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Image,
  Button,
} from "@heroui/react";
import Link from "next/link";
import { useState } from "react";
import UserDataMenu from "./userDataMenu";
import { useUserStore } from "../store";
import MenuApp from "./MenuApp";

export default function MenuBarComponentSecondary({
  userData,
  notifications,
}: {
  userData: basicUserData;
  notifications: number;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <Navbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen} className="standalone:!hidden">
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Image
              className="max-h-8 overflow-visible"
              src="/images/brand/LOGO_.png"
              alt=""
            />
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {!userData.loggedIn && (
            <>
              <NavbarItem>
                <Link prefetch color="foreground" href="/">
                  Home
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link prefetch color="foreground" href="/esplora">
                  Esplora
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link prefetch color="foreground" href="/globalsongs">
                  Canzoni
                </Link>
              </NavbarItem>
            </>
          )}

          {userData.loggedIn && (
            <>
              <NavbarItem>
                <Link prefetch color="foreground" href="/songs">
                  Canzoni
                </Link>
              </NavbarItem>
              <NavbarItem isActive>
                <Link prefetch aria-current="page" href="/setlist">
                  Eventi
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link prefetch color="foreground" href="/people">
                  People
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link prefetch color="foreground" href="/calendar">
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
              prefetch
              onClick={() => setIsMenuOpen(false)}
              color="foreground"
              href="/songs"
            >
              Canzoni
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link
              prefetch
              onClick={() => setIsMenuOpen(false)}
              aria-current="page"
              href="/setlist"
            >
              Eventi
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link
              prefetch
              onClick={() => setIsMenuOpen(false)}
              aria-current="page"
              href="/people"
            >
              Persone
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              prefetch
              onClick={() => setIsMenuOpen(false)}
              color="foreground"
              href="/calendar"
            >
              Calendario
            </Link>
          </NavbarItem>
          {!userData.loggedIn && (
            <>
              <NavbarItem className=" lg:flex">
                <Link prefetch href="/login">
                  Accedi
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link prefetch color="primary" href="/sign-up">
                  Iscriviti
                </Link>
              </NavbarItem>
            </>
          )}
        </NavbarMenu>
      </Navbar>
      <MenuApp
        userdata={userData}
        notifications={notifications}
        isLoggedIn={userData.loggedIn ? true : false}
      />
    </>
  );
}
