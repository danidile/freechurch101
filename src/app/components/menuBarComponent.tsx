"use client";

import { basicUserData } from "@/utils/types/userData";

import {
  Image,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";
import UserDataMenu from "./userDataMenu";
import MenuApp from "./MenuApp";
import { TransitionLink } from "./TransitionLink";
import { notificationT } from "@/utils/types/types";

export default function MenuBarComponent({
  userData,
  notifications,
}: {
  userData: basicUserData;
  notifications: number;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = ["songs", "setlist"];
  return (
    <>
      <Navbar
        style={{
          display: userData.loggedIn ? "none" : "block",
        }}
        onMenuOpenChange={setIsMenuOpen}
        className="menu-desktop standalone:!hidden"
      >
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <TransitionLink href="/">
            <Image
              className="max-h-8 overflow-visible"
              src="/images/brand/LOGO_.png"
              alt=""
            />
          </TransitionLink>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4 flex-row justify-center">
          <NavbarItem>
            <TransitionLink href="/songs">Canzoni</TransitionLink>
          </NavbarItem>

          {userData.loggedIn && (
            <NavbarItem>
              <TransitionLink aria-current="page" href="/setlist">
                Eventi
              </TransitionLink>
            </NavbarItem>
          )}
          {userData.loggedIn && (
            <NavbarItem>
              <TransitionLink aria-current="page" href="/people">
                People
              </TransitionLink>
            </NavbarItem>
          )}
        </NavbarContent>

        <UserDataMenu userData={userData} />

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link color="foreground" href={`/${item}`} size="lg">
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
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
