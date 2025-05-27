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

export default function MenuBarComponentSecondary({
  userData,
  notifications,
}: {
  userData: basicUserData;
  notifications: number;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} disableAnimation={false}>
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
        <NavbarItem>
          <Link prefetch color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>
                )}

        <NavbarItem>
          <Link prefetch color="foreground" href="/songs">
            Canzoni
          </Link>
        </NavbarItem>
        {userData.loggedIn && (
          <>
            <NavbarItem isActive>
              <Link prefetch aria-current="page" href="/setlist">
                Eventi
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link prefetch color="foreground" href="/people">
                Esplora
              </Link>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <UserDataMenu userData={userData} />

      {/* // Mobile Menu */}
      <NavbarMenu>
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
          <Link prefetch color="foreground" href="/calendario">
            Calendario
          </Link>
        </NavbarItem>
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
      </NavbarMenu>
    </Navbar>
  );
}
